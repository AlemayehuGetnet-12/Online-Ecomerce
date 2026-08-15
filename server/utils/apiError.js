/**
 * Safe error responder — never leaks raw error internals to clients in production.
 * Pass the error object and a fallback message for 500s.
 */
export const serverError = (res, error, context = 'Operation') => {
  // Log full error server-side
  console.error(`[${context}]`, error)

  // Only pass through message in development
  const message =
    process.env.NODE_ENV === 'development'
      ? error.message
      : 'An unexpected error occurred. Please try again.'

  return res.status(500).json({ success: false, message })
}
