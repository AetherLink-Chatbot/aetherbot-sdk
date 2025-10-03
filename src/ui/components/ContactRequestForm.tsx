import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Send, AlertCircle, User, MessageSquare } from 'lucide-react';

export type ContactMethod = 'email' | 'call';

export interface ContactRequestValues {
  name: string;
  contact_method: ContactMethod;
  contact_value: string;
  concern_text: string;
}

export function ContactRequestForm({
  promptText,
  onSubmit,
  submitting = false,
}: {
  promptText: string;
  onSubmit: (values: ContactRequestValues) => void | Promise<void>;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<ContactRequestValues>({
    name: '',
    contact_method: 'email',
    contact_value: '',
    concern_text: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const contactLabel = useMemo(
    () => (values.contact_method === 'email' ? 'Email address' : 'Phone number'),
    [values.contact_method]
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!values.name.trim()) return setError('Please enter your name.');
    if (!values.concern_text.trim()) return setError('Please describe your concern.');
    if (!values.contact_value.trim()) return setError(`Please enter your ${values.contact_method === 'email' ? 'email' : 'phone number'}.`);
    await onSubmit(values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="prose prose-sm max-w-none mb-4 text-sm leading-relaxed" 
        style={{ color: 'var(--aether-text)', opacity: 0.9 } as React.CSSProperties}
      >
        <p>{promptText}</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--aether-text)', opacity: 0.8 } as React.CSSProperties}>
            <User className="inline-block w-3.5 h-3.5 mr-1 mb-0.5" />
            Name
          </label>
          <div className="relative">
            <input
              type="text"
              value={values.name}
              onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              className="w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none"
              style={{ 
                backgroundColor: 'var(--aether-bg)', 
                color: 'var(--aether-text)', 
                borderColor: focusedField === 'name' ? 'var(--aether-secondary)' : 'rgba(0,0,0,0.12)',
                boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(120, 57, 144, 0.1)' : 'none'
              } as React.CSSProperties}
              placeholder="Your name"
              disabled={submitting}
            />
          </div>
        </motion.div>

        {/* Contact Method Selector */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--aether-text)', opacity: 0.8 } as React.CSSProperties}>
            Contact Method
          </label>
          <div className="inline-flex rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(0,0,0,0.12)' } as React.CSSProperties}>
            {(['email','call'] as ContactMethod[]).map((m) => (
              <motion.button
                key={m}
                type="button"
                onClick={() => setValues((v) => ({ ...v, contact_method: m }))}
                className="px-4 py-2 text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
                style={values.contact_method === m
                  ? ({ backgroundColor: 'var(--aether-secondary)', color: '#ffffff' } as React.CSSProperties)
                  : ({ backgroundColor: 'var(--aether-bg)', color: 'var(--aether-text)', opacity: 0.7 } as React.CSSProperties)}
                disabled={submitting}
                whileHover={values.contact_method !== m ? { opacity: 1 } : {}}
                whileTap={{ scale: 0.98 }}
              >
                {m === 'email' ? <Mail className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                {m === 'email' ? 'Email' : 'Call'}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contact Value Field */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--aether-text)', opacity: 0.8 } as React.CSSProperties}>
            {values.contact_method === 'email' ? (
              <>
                <Mail className="inline-block w-3.5 h-3.5 mr-1 mb-0.5" />
                {contactLabel}
              </>
            ) : (
              <>
                <Phone className="inline-block w-3.5 h-3.5 mr-1 mb-0.5" />
                {contactLabel}
              </>
            )}
          </label>
          <AnimatePresence mode="wait">
            <motion.div
              key={values.contact_method}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                inputMode={values.contact_method === 'email' ? 'email' : 'tel'}
                value={values.contact_value}
                onChange={(e) => setValues((v) => ({ ...v, contact_value: e.target.value }))}
                onFocus={() => setFocusedField('contact')}
                onBlur={() => setFocusedField(null)}
                className="w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none"
                style={{ 
                  backgroundColor: 'var(--aether-bg)', 
                  color: 'var(--aether-text)', 
                  borderColor: focusedField === 'contact' ? 'var(--aether-secondary)' : 'rgba(0,0,0,0.12)',
                  boxShadow: focusedField === 'contact' ? '0 0 0 3px rgba(120, 57, 144, 0.1)' : 'none'
                } as React.CSSProperties}
                placeholder={values.contact_method === 'email' ? 'name@example.com' : '+1 (555) 555-5555'}
                disabled={submitting}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Concern Text Area */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--aether-text)', opacity: 0.8 } as React.CSSProperties}>
            <MessageSquare className="inline-block w-3.5 h-3.5 mr-1 mb-0.5" />
            Concern
          </label>
          <textarea
            value={values.concern_text}
            onChange={(e) => setValues((v) => ({ ...v, concern_text: e.target.value }))}
            onFocus={() => setFocusedField('concern')}
            onBlur={() => setFocusedField(null)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm transition-all duration-200 focus:outline-none resize-none"
            style={{ 
              backgroundColor: 'var(--aether-bg)', 
              color: 'var(--aether-text)', 
              borderColor: focusedField === 'concern' ? 'var(--aether-secondary)' : 'rgba(0,0,0,0.12)',
              boxShadow: focusedField === 'concern' ? '0 0 0 3px rgba(120, 57, 144, 0.1)' : 'none'
            } as React.CSSProperties}
            placeholder="Briefly describe the issue or request..."
            rows={3}
            disabled={submitting}
          />
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' } as React.CSSProperties}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div
          className="pt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            type="submit"
            className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-all duration-200"
            style={{ backgroundColor: 'var(--aether-secondary)' } as React.CSSProperties}
            disabled={submitting}
            whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(120, 57, 144, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to representative
              </>
            )}
          </motion.button>
        </motion.div>
      </form>
    </motion.div>
  );
}

export default ContactRequestForm;