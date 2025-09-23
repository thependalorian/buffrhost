
'use client';

import { useState, useEffect } from 'react';
// Assuming a hook for email templates management exists or will be created
// import { useEmailTemplates } from '@/lib/hooks/useEmailTemplates';

export default function EmailTemplateManager() {
  // const { templates, loading, error, createTemplate, updateTemplate, deleteTemplate } = useEmailTemplates();
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Mock data for demonstration
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTemplates([
        { id: '1', name: 'Booking Confirmation', subject: 'Your Booking is Confirmed!', body: '...' },
        { id: '2', name: 'Cancellation Notice', subject: 'Booking Cancelled', body: '...' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // A simple form for creating/editing templates
  const TemplateForm = ({ template, onSave }: { template?: any, onSave: (data: any) => void }) => {
    const [name, setName] = useState(template?.name || '');
    const [subject, setSubject] = useState(template?.subject || '');
    const [body, setBody] = useState(template?.body || '');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({ id: template?.id, name, subject, body });
      setSelectedTemplate(null); // Close form after save
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-base-200">
        <h3 className="text-lg font-bold">{template?.id ? 'Edit Template' : 'Create New Template'}</h3>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Template Name" className="input input-bordered w-full" required />
        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="input input-bordered w-full" required />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body (HTML or plain text)" className="textarea textarea-bordered w-full h-48" required />
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={() => setSelectedTemplate(null)} className="btn btn-ghost">Cancel</button>
          <button type="submit" className="btn btn-primary">Save Template</button>
        </div>
      </form>
    );
  };

  const createNewTemplate = (data: any) => {
    alert(`Creating template ${data.name}`);
    // Implement actual create logic
    setTemplates([...templates, { ...data, id: `new-${templates.length + 1}` }]);
  };

  const updateExistingTemplate = (data: any) => {
    alert(`Updating template ${data.name}`);
    // Implement actual update logic
    setTemplates(templates.map(t => t.id === data.id ? data : t));
  };

  const deleteExistingTemplate = (id: string) => {
    alert(`Deleting template ${id}`);
    // Implement actual delete logic
    setTemplates(templates.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Email Template Management</h2>
      <button onClick={() => setSelectedTemplate({})} className="btn btn-primary">Create New Template</button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {selectedTemplate && <TemplateForm template={selectedTemplate} onSave={selectedTemplate.id ? updateExistingTemplate : createNewTemplate} />}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.id}>
                <td>{template.name}</td>
                <td>{template.subject}</td>
                <td className="space-x-2">
                  <button onClick={() => setSelectedTemplate(template)} className="btn btn-sm">Edit</button>
                  <button onClick={() => deleteExistingTemplate(template.id)} className="btn btn-sm btn-error">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
