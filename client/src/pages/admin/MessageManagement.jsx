import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../components/admin/AdminLayout'
import Loader from '../../components/common/Loader'
import toast from 'react-hot-toast'
import { contactAPI } from '../../services/api'
import {
  MdMail, MdMarkEmailRead, MdDelete, MdClose, MdSearch, MdInbox,
  MdPerson, MdEmail, MdSubject, MdAccessTime,
} from 'react-icons/md'

const subjectLabels = {
  order:    'Order Issue',
  delivery: 'Delivery Question',
  payment:  'Payment Problem',
  product:  'Product Inquiry',
  return:   'Return / Refund',
  other:    'Other',
}

const subjectColors = {
  order:    'badge-info',
  delivery: 'badge-warning',
  payment:  'badge-danger',
  product:  'badge-success',
  return:   'badge-gray',
  other:    'badge-gray',
}

const MessageManagement = () => {
  const [messages,   setMessages]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState('all') // all | unread | read
  const [unreadCount, setUnreadCount] = useState(0)
  const [selected,   setSelected]   = useState(null)  // selected message for modal
  const [deleting,   setDeleting]   = useState(false)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter === 'unread') params.isRead = 'false'
      if (filter === 'read')   params.isRead = 'true'
      if (search)              params.search = search

      const { data } = await contactAPI.getMessages(params)
      setMessages(data.messages || [])
      setUnreadCount(data.unreadCount || 0)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [filter, search])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const openMessage = async (msg) => {
    setSelected(msg)
    // Mark as read if unread
    if (!msg.isRead) {
      try {
        await contactAPI.markAsRead(msg._id)
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m))
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch {
        // silent fail — still show the message
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return
    setDeleting(true)
    try {
      await contactAPI.deleteMessage(id)
      toast.success('Message deleted')
      setMessages(prev => prev.filter(m => m._id !== id))
      if (selected?._id === id) setSelected(null)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete message')
    } finally {
      setDeleting(false)
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <AdminLayout title="Messages">
      {/* ── Stats bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
            <MdInbox className="text-xl text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{messages.length}</p>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Total Messages</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
            <MdMail className="text-xl text-[#ea580c]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{unreadCount}</p>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Unread</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <MdMarkEmailRead className="text-xl text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-[#e2e8f0]">{messages.filter(m => m.isRead).length}</p>
            <p className="text-xs text-gray-500 dark:text-[#94a3b8]">Read</p>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input text-sm pl-9"
            placeholder="Search messages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 bg-gray-100 dark:bg-[#1e293b] rounded-lg p-1">
          {[
            { key: 'all',    label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'read',   label: 'Read' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-white dark:bg-[#334155] text-[#ea580c] shadow-sm'
                  : 'text-gray-500 dark:text-[#94a3b8] hover:text-gray-700 dark:hover:text-[#e2e8f0]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages list ── */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MdMail className="text-6xl text-gray-300 dark:text-[#334155] mb-3" />
            <p className="text-gray-500 dark:text-[#94a3b8] text-sm">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#334155]">
            {messages.map(msg => (
              <div
                key={msg._id}
                onClick={() => openMessage(msg)}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-[#1e293b] ${
                  !msg.isRead ? 'bg-orange-50/50 dark:bg-[#1e293b]/50' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  msg.isRead ? 'bg-gray-400' : 'bg-[#ea580c]'
                }`}>
                  {msg.name?.[0]?.toUpperCase() || '?'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm truncate ${!msg.isRead ? 'font-bold text-gray-900 dark:text-[#e2e8f0]' : 'font-medium text-gray-700 dark:text-[#94a3b8]'}`}>
                      {msg.name}
                    </p>
                    {!msg.isRead && (
                      <span className="w-2 h-2 bg-[#ea580c] rounded-full flex-shrink-0" />
                    )}
                    <span className={`badge ${subjectColors[msg.subject] || 'badge-gray'} text-[10px] py-0.5`}>
                      {subjectLabels[msg.subject] || msg.subject}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-[#94a3b8] mb-1">{msg.email}</p>
                  <p className="text-sm text-gray-600 dark:text-[#94a3b8] line-clamp-1">
                    {msg.message}
                  </p>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-400 dark:text-[#64748b] flex-shrink-0 whitespace-nowrap">
                  {formatDate(msg.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Message detail modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ea580c] flex items-center justify-center text-white font-bold text-sm">
                    {selected.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-[#e2e8f0]">{selected.name}</p>
                    <p className="text-xs text-gray-500 dark:text-[#94a3b8]">{selected.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#334155] transition-colors"
                >
                  <MdClose className="text-xl text-gray-500 dark:text-[#94a3b8]" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MdSubject className="text-gray-400" />
                    <span className="text-gray-500 dark:text-[#94a3b8]">Subject:</span>
                    <span className={`badge ${subjectColors[selected.subject] || 'badge-gray'}`}>
                      {subjectLabels[selected.subject] || selected.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MdAccessTime className="text-gray-400" />
                    <span className="text-gray-500 dark:text-[#94a3b8]">{formatDate(selected.createdAt)}</span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-[#64748b] mb-2">Message</p>
                  <div className="bg-gray-50 dark:bg-[#0f172a] rounded-xl p-4 text-sm text-gray-700 dark:text-[#e2e8f0] leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>
                </div>

                {/* Reply actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${subjectLabels[selected.subject] || 'Your message'}`}
                    className="btn btn-primary py-2 px-4 text-sm gap-2"
                  >
                    <MdEmail /> Reply via Email
                  </a>
                  <a
                    href={`https://t.me/${selected.email?.split('@')[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary py-2 px-4 text-sm gap-2"
                  >
                    <MdPerson /> Contact
                  </a>
                  <button
                    onClick={() => handleDelete(selected._id)}
                    disabled={deleting}
                    className="btn btn-danger py-2 px-4 text-sm gap-2 ml-auto"
                  >
                    <MdDelete /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default MessageManagement