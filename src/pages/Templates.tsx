import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useStakeholderTemplates } from '@/hooks/useStakeholderTemplates';
import Card from '@/components/Card';
import TemplateFormModal from '@/components/TemplateFormModal';
import { StakeholderTemplate } from '@/types/stakeholder';

const Templates: React.FC = () => {
  const { templates, isLoading, fetchTemplates, deleteTemplate } =
    useStakeholderTemplates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<
    StakeholderTemplate | undefined
  >(undefined);

  // We'll just fetch all on mount
  useEffect(() => {
    fetchTemplates({ limit: 100 });
  }, [fetchTemplates]);

  const handleOpenModal = (template?: StakeholderTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(undefined);
  };

  return (
    <>
      <Helmet>
        <title>Template Library - Admin</title>
        <meta name="description" content="Manage stakeholder templates" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Template Library
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage the master list of stakeholder templates for the entire
              platform. Admin access only.
            </p>
          </div>
          <button
            className="px-4 py-2 font-bold text-white rounded bg-primary-600 hover:bg-primary-700"
            onClick={() => handleOpenModal()}
          >
            + Add Template
          </button>
        </div>

        {isLoading && templates.length === 0 ? (
          <div>Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => (
              <div
                key={template.id}
                className="relative group cursor-pointer"
                onClick={() => handleOpenModal(template)}
              >
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        'Are you sure you want to delete this template?'
                      )
                    ) {
                      deleteTemplate(template.id).then(() =>
                        fetchTemplates({ limit: 100 })
                      );
                    }
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2"
                  title="Delete Template"
                >
                  ✕
                </button>
                <Card title={template.name} hover>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <strong>Role:</strong> {template.positionRole || 'None'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Group:</strong> {template.group || 'None'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Score:</strong> {template.score || 0}
                  </p>
                </Card>
              </div>
            ))}
            {templates.length === 0 && (
              <div className="col-span-3 py-10 text-center text-gray-500">
                No templates found.
              </div>
            )}
          </div>
        )}
      </div>

      <TemplateFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={editingTemplate}
      />
    </>
  );
};

export default Templates;
