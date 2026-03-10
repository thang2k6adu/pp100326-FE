import React, { useEffect, useState, useMemo } from 'react';
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    'Core Stakeholders'
  );
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(
    null
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'INTERNAL (Nội bộ)',
  ]);

  const coreStakeholders = useMemo(() => {
    // Sort logic: Score (Descending) -> Then Internal Classification First
    const sorted = [...templates].sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;

      const aIsInternal = a.classification === 'Internal' ? 1 : 0;
      const bIsInternal = b.classification === 'Internal' ? 1 : 0;
      return bIsInternal - aIsInternal;
    });

    // Top 12 stakeholders
    return sorted.slice(0, 12);
  }, [templates]);

  const groupStats = useMemo(() => {
    const stats: Record<string, number> = {
      'Core Stakeholders': coreStakeholders.length,
      'All Stakeholders': templates.length,
    };
    templates.forEach(t => {
      const groupName = t.group || 'No Group';
      stats[groupName] = (stats[groupName] || 0) + 1;
    });
    return stats;
  }, [templates, coreStakeholders.length]);

  const categorizedGroups = useMemo(() => {
    const categories: Record<string, { name: string; count: number }[]> = {
      VIEWS: [],
      'INTERNAL (Nội bộ)': [],
      'EXTERNAL (Bên ngoài)': [],
      'GOVERNANCE & ACADEMIC': [],
    };

    const mapToCategory = (name: string) => {
      if (name === 'Core Stakeholders' || name === 'All Stakeholders')
        return 'VIEWS';

      const internals = [
        'Project Team',
        'Management & Leadership',
        'Support Functions',
        'IT/Software Project Specific',
      ];
      if (internals.includes(name)) return 'INTERNAL (Nội bộ)';

      const externals = [
        'Customers & Users',
        'Vendors & Suppliers',
        'Partners',
        'Partners & Collaborators',
        'Public & Community',
        'Community & Society',
        'Media & Public',
        'Competition & Market',
      ];
      if (externals.includes(name)) return 'EXTERNAL (Bên ngoài)';

      const governance = [
        'Regulatory & Compliance',
        'Regulatory & Government',
        'Financial & Investors',
        'Financial Stakeholders',
        'Academic/Educational Specific',
        'Governance & Oversight',
      ];
      if (governance.includes(name)) return 'GOVERNANCE & ACADEMIC';

      return null;
    };

    Object.entries(groupStats).forEach(([name, count]) => {
      const cat = mapToCategory(name);
      if (cat && categories[cat]) {
        categories[cat].push({ name, count });
      }
    });

    // Custom sorting for specific categories
    const categorySortOrders = {
      VIEWS: ['Core Stakeholders', 'All Stakeholders'],
      'INTERNAL (Nội bộ)': [
        'Management & Leadership',
        'Project Team',
        'IT/Software Project Specific',
        'Support Functions',
      ],
    };

    return Object.entries(categories)
      .filter(([, items]) => items.length > 0)
      .map(([catName, items]) => {
        if (categorySortOrders[catName as keyof typeof categorySortOrders]) {
          const sortingArr =
            categorySortOrders[catName as keyof typeof categorySortOrders];
          items.sort((a, b) => {
            const idxA = sortingArr.indexOf(a.name);
            const idxB = sortingArr.indexOf(b.name);
            // If not in standard list, put at end
            const safeIdxA = idxA === -1 ? 999 : idxA;
            const safeIdxB = idxB === -1 ? 999 : idxB;
            return safeIdxA - safeIdxB;
          });
        } else {
          // Fallback alphabetical sort for other categories
          items.sort((a, b) => a.name.localeCompare(b.name));
        }
        return [catName, items] as [string, { name: string; count: number }[]];
      });
  }, [groupStats]);

  const displayedTemplates = useMemo(() => {
    let filtered = templates;
    if (selectedGroup === 'Core Stakeholders') {
      filtered = coreStakeholders;
    } else if (selectedGroup && selectedGroup !== 'All Stakeholders') {
      if (selectedGroup === 'No Group') {
        filtered = templates.filter(t => !t.group);
      } else {
        filtered = templates.filter(t => t.group === selectedGroup);
      }
    }

    // Sort by score descending
    return [...filtered].sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [templates, selectedGroup, coreStakeholders]);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates({ limit: 100 }); // fetch up to 100 templates
    }
  }, [isOpen, fetchTemplates]);

  if (!isOpen) return null;

  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTemplates(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedTemplateId(prev => (prev === id ? null : id));
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
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
          <div className="relative flex-auto p-0 flex max-h-[70vh] min-h-[50vh]">
            {/* Sidebar */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-y-auto p-4 space-y-3">
              {categorizedGroups.map(([categoryName, items]) => (
                <div key={categoryName}>
                  {categoryName !== 'VIEWS' && (
                    <button
                      type="button"
                      onClick={() => toggleCategory(categoryName)}
                      className="w-full flex items-center justify-between text-left mb-1 group px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                    >
                      <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200">
                        {categoryName}
                      </h4>
                      <svg
                        className={`w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-transform duration-200 ${
                          expandedCategories.includes(categoryName)
                            ? 'transform rotate-180'
                            : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                  {(categoryName === 'VIEWS' ||
                    expandedCategories.includes(categoryName)) && (
                    <div
                      className={
                        categoryName !== 'VIEWS'
                          ? 'mt-1 pl-1 ml-3 border-l-2 border-gray-200 dark:border-gray-700'
                          : ''
                      }
                    >
                      <ul className="space-y-0.5">
                        {items.map(({ name, count }) => (
                          <li key={name}>
                            <button
                              type="button"
                              onClick={() => setSelectedGroup(name)}
                              className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex justify-between items-center ${
                                selectedGroup === name
                                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 font-medium'
                                  : 'text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700/50'
                              }`}
                            >
                              <span className="truncate pr-2 flex items-center gap-1.5">
                                {name === 'Core Stakeholders' && (
                                  <svg
                                    className="w-4 h-4 text-yellow-400 fill-current mb-0.5"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )}
                                <span
                                  className={
                                    name === 'Core Stakeholders'
                                      ? 'font-bold text-gray-800 dark:text-gray-100'
                                      : ''
                                  }
                                >
                                  {name}
                                </span>
                              </span>
                              <span className="inline-block bg-gray-100 dark:bg-gray-700 text-xs py-0.5 px-2 rounded-full text-gray-500 dark:text-gray-400">
                                {count}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Template List */}
            <div className="w-2/3 p-0 overflow-y-auto bg-white dark:bg-gray-800">
              {isLoading ? (
                <div className="text-center py-8">Loading templates...</div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayedTemplates.map(template => {
                    const score = template.score || 0;
                    let scoreColor =
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
                    if (score >= 15)
                      scoreColor =
                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
                    else if (score >= 10)
                      scoreColor =
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';

                    return (
                      <div
                        key={template.id}
                        className={`border-b last:border-0 border-gray-100 dark:border-gray-700 transition-colors ${
                          expandedTemplateId === template.id
                            ? 'bg-gray-50 dark:bg-gray-700/30'
                            : ''
                        }`}
                      >
                        <div
                          onClick={() => toggleExpand(template.id)}
                          className={`p-3 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                            selectedTemplates.includes(template.id)
                              ? 'bg-primary-50/50 dark:bg-primary-900/10'
                              : ''
                          }`}
                        >
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={selectedTemplates.includes(template.id)}
                              onChange={() => {
                                // Handled by onClick below to ensure propagation is stopped
                              }}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                              onClick={e => toggleSelection(template.id, e)}
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 min-w-0 pr-4">
                                <div className="mb-1">
                                  <span
                                    className="font-semibold text-gray-900 dark:text-white truncate max-w-full text-base"
                                    title={template.positionRole || 'No Role'}
                                  >
                                    {template.positionRole || 'No Role'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <p
                                    className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-s md:max-w-sm"
                                    title={template.name}
                                  >
                                    {template.name}
                                  </p>
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4 w-[76px] flex justify-end">
                                <span
                                  className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold w-full ${scoreColor}`}
                                >
                                  Score: {score}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details Section */}
                        {expandedTemplateId === template.id && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="col-span-2">
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Name:
                                </p>
                                <p className="font-medium text-base dark:text-gray-200">
                                  {template.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Position / Role:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {template.positionRole || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Group:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {template.group || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Score:
                                </p>
                                <span
                                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${scoreColor}`}
                                >
                                  {score}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Classification:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {template.classification || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Phase of Most Impact:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {template.phaseOfMostImpact || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Power / Influence / Interest:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {template.power || '-'} /{' '}
                                  {template.influence || '-'} /{' '}
                                  {template.interest || '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Attitude (Current / Desired):
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {template.currentAttitude || '-'} &rarr;{' '}
                                  {template.desiredAttitude || '-'}
                                </p>
                              </div>
                              {template.expectations && (
                                <div className="col-span-2 mt-2">
                                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                                    Expectations:
                                  </p>
                                  <p className="dark:text-gray-200">
                                    {template.expectations}
                                  </p>
                                </div>
                              )}
                              {template.requirements && (
                                <div className="col-span-2 mt-2">
                                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                                    Requirements:
                                  </p>
                                  <p className="dark:text-gray-200">
                                    {template.requirements}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {displayedTemplates.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No templates found in this group.
                    </div>
                  )}
                </div>
              )}
            </div>
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
