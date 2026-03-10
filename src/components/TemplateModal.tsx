import React, { useEffect, useState } from 'react';
import { useStakeholderTemplates } from '@/hooks/useStakeholderTemplates';
import { useStakeholders } from '@/hooks/useStakeholders';
import Button from './Button';
import toast from 'react-hot-toast';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const { templates, fetchTemplates, isLoading } = useStakeholderTemplates();
  const { createStakeholder } = useStakeholders();
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates({ limit: 100 }); // fetch up to 100 templates
    }
  }, [isOpen, fetchTemplates]);

  if (!isOpen) return null;

  const toggleSelection = (id: string) => {
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    if (selectedTemplates.length === 0) return;
    const toImport = templates.filter(t => selectedTemplates.includes(t.id));

    try {
      // Import them one by one
      for (const template of toImport) {
        await createStakeholder({
          projectId,
          name: template.name,
          positionRole: template.positionRole,
          group: template.group,
          classification: template.classification,
          power: template.power,
          interest: template.interest,
          influence: template.influence,
          currentAttitude: template.currentAttitude,
          desiredAttitude: template.desiredAttitude,
          requirements: template.requirements,
          expectations: template.expectations,
          phaseOfMostImpact: template.phaseOfMostImpact,
          score: template.score,
        });
      }
      toast.success(
        `Imported ${selectedTemplates.length} templates successfully`
      );
      onClose();
    } catch {
      toast.error('Failed to import templates');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-gray-800">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Template Library Export
            </h3>
            <button
              className="p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-50 focus:outline-none dark:text-white"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl text-gray-500 bg-transparent outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <div className="relative flex-auto p-6 max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-4">Loading templates...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => toggleSelection(template.id)}
                    className={`p-4 border rounded cursor-pointer transition-colors ${
                      selectedTemplates.includes(template.id)
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {template.positionRole}
                    </p>
                    <div className="mt-2 text-xs flex flex-wrap gap-2">
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {template.group || 'No Group'}
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {template.classification}
                      </span>
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        Power: {template.power}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {templates.length === 0 && !isLoading && (
              <div className="text-center py-4 text-gray-500">
                No templates found.
              </div>
            )}
          </div>
          <div className="flex items-center justify-between p-6 border-t border-solid rounded-b border-blueGray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500">
              {selectedTemplates.length} templates selected
            </span>
            <div>
              <Button variant="ghost" onClick={onClose} className="mr-2">
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={selectedTemplates.length === 0}
              >
                Import Selected
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;
