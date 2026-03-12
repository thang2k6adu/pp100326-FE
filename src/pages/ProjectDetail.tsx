import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/Button';
import { Stakeholder } from '@/types/stakeholder';
import StakeholderForm from '@/components/StakeholderForm';
import TemplateModal from '@/components/TemplateModal';
import * as XLSX from 'xlsx';
import { stakeholderService } from '@/services/stakeholderService';
import toast from 'react-hot-toast';
const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    fetchProjectById,
    currentProject,
    isLoading: isProjectLoading,
  } = useProjects();
  const {
    stakeholders,
    fetchStakeholders,
    deleteStakeholder,
    isLoading: isStakeholdersLoading,
    page,
    total,
    limit,
  } = useStakeholders();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<
    Stakeholder | undefined
  >();

  const [selectedGroup, setSelectedGroup] = useState<string | null>(
    'Core Stakeholders'
  );
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'INTERNAL (Nội bộ)',
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStakeholderId, setExpandedStakeholderId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchStakeholders({ projectId: id });
    }
  }, [id, fetchProjectById, fetchStakeholders]);

  const handleEdit = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedStakeholder(undefined);
    setIsFormOpen(false);
    if (id) {
      fetchStakeholders({ projectId: id });
    }
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    if (id) {
      fetchStakeholders({ projectId: id });
    }
  };

  const coreStakeholders = useMemo(() => {
    // Sort logic: Score (Descending) -> Then Internal Classification First
    const sorted = [...stakeholders].sort((a, b) => {
      const scoreDiff = (b.score || 0) - (a.score || 0);
      if (scoreDiff !== 0) return scoreDiff;

      const aIsInternal = a.classification === 'Internal' ? 1 : 0;
      const bIsInternal = b.classification === 'Internal' ? 1 : 0;
      return bIsInternal - aIsInternal;
    });

    return sorted.slice(0, 12);
  }, [stakeholders]);

  const groupStats = useMemo(() => {
    const stats: Record<string, number> = {};
    stakeholders.forEach(s => {
      if (s.group) {
        stats[s.group] = (stats[s.group] || 0) + 1;
      }
    });
    return stats;
  }, [stakeholders]);

  const categorizedGroups = useMemo(() => {
    const categories: Record<string, { name: string; count: number }[]> = {
      VIEWS: [
        { name: 'Core Stakeholders', count: coreStakeholders.length },
        { name: 'All Stakeholders', count: stakeholders.length },
      ],
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
            const safeIdxA = idxA === -1 ? 999 : idxA;
            const safeIdxB = idxB === -1 ? 999 : idxB;
            return safeIdxA - safeIdxB;
          });
        } else {
          items.sort((a, b) => a.name.localeCompare(b.name));
        }
        return [catName, items] as [string, { name: string; count: number }[]];
      });
  }, [groupStats, coreStakeholders.length, stakeholders.length]);

  const displayedStakeholders = useMemo(() => {
    let filtered = stakeholders;
    if (selectedGroup === 'Core Stakeholders') {
      filtered = coreStakeholders;
    } else if (selectedGroup !== 'All Stakeholders' && selectedGroup) {
      filtered = stakeholders.filter(s => s.group === selectedGroup);
    }

    let sorted = [...filtered].sort((a, b) => (b.score || 0) - (a.score || 0));

    if (searchTerm.trim()) {
      const lowerQuery = searchTerm.toLowerCase();
      sorted = sorted.filter(
        s =>
          (s.name && s.name.toLowerCase().includes(lowerQuery)) ||
          (s.positionRole &&
            s.positionRole.toLowerCase().includes(lowerQuery)) ||
          (s.group && s.group.toLowerCase().includes(lowerQuery))
      );
    }

    return sorted;
  }, [stakeholders, selectedGroup, coreStakeholders, searchTerm]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleExportExcel = async () => {
    try {
      const toastId = toast.loading('Preparing export data...');

      const response = await stakeholderService.getStakeholders({
        projectId: id,
        page: 1,
        limit: 100,
      });

      // response is StakeholderListResponse: { error, code, message, data: { items, meta }, traceId }
      let exportItems: Stakeholder[] = response.data?.items || [];

      if (selectedGroup === 'Core Stakeholders') {
        const sorted = [...exportItems].sort(
          (a: Stakeholder, b: Stakeholder) => {
            const scoreDiff = (b.score || 0) - (a.score || 0);
            if (scoreDiff !== 0) return scoreDiff;
            const aIsInternal = a.classification === 'Internal' ? 1 : 0;
            const bIsInternal = b.classification === 'Internal' ? 1 : 0;
            return bIsInternal - aIsInternal;
          }
        );
        exportItems = sorted.slice(0, 12);
      } else if (selectedGroup !== 'All Stakeholders' && selectedGroup) {
        exportItems = exportItems.filter(
          (s: Stakeholder) => s.group === selectedGroup
        );
      }

      exportItems.sort(
        (a: Stakeholder, b: Stakeholder) => (b.score || 0) - (a.score || 0)
      );

      if (searchTerm.trim()) {
        const lowerQuery = searchTerm.toLowerCase();
        exportItems = exportItems.filter(
          (s: Stakeholder) =>
            (s.name && s.name.toLowerCase().includes(lowerQuery)) ||
            (s.positionRole &&
              s.positionRole.toLowerCase().includes(lowerQuery)) ||
            (s.group && s.group.toLowerCase().includes(lowerQuery))
        );
      }

      const exportData = exportItems.map((s: Stakeholder) => ({
        name: s.name || '',
        Position: s.positionRole || '',
        'Contact Information': s.contactInformation || '',
        requirements: s.requirements || '',
        Expectations: s.expectations || '',
        Classification: s.classification || '',
        power: s.power || '',
        Interest: s.interest || '',
        Influence: s.influence || '',
        Attitude: `${s.currentAttitude || ''} -> ${s.desiredAttitude || ''}`,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Stakeholders');

      // Auto-size columns slightly
      const colWidths = [
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 40 },
        { wch: 40 },
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 25 },
      ];
      worksheet['!cols'] = colWidths;

      XLSX.writeFile(
        workbook,
        `${currentProject?.name || 'Project'}_Stakeholders.xlsx`
      );

      toast.success('Export completed successfully!', { id: toastId });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  if (isProjectLoading || !currentProject) {
    return <div>Loading project details...</div>;
  }

  return (
    <>
      <Helmet>
        <title>{currentProject.name} - Stakeholders</title>
        <meta name="description" content="Stakeholder Register" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            &larr; Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentProject.name}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {currentProject.description}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Stakeholder Register
            </h2>
            <div className="space-x-3">
              <Button variant="outline" onClick={handleExportExcel}>
                Export Excel
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsTemplateModalOpen(true)}
              >
                Import from Library
              </Button>
              <Button variant="primary" onClick={() => setIsFormOpen(true)}>
                + Add Stakeholder
              </Button>
            </div>
          </div>

          {/* Main Layout Area */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden min-h-[600px] h-[calc(100vh-250px)]">
            {/* Sidebar */}
            <div className="w-1/4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  placeholder="Search stakeholders..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-700 dark:text-white focus:outline-none focus:ring focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="p-4 space-y-3 flex-1 overflow-y-auto">
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
                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${
                                  selectedGroup === name
                                    ? 'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300'
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
            </div>

            {/* Stakeholder List */}
            <div className="w-3/4 p-0 bg-white dark:bg-gray-800 overflow-y-auto">
              {isStakeholdersLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Loading stakeholders...
                </div>
              ) : displayedStakeholders.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {displayedStakeholders.map(stakeholder => {
                    const score = stakeholder.score || 0;
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
                        key={stakeholder.id}
                        className={`border-b last:border-0 border-gray-100 dark:border-gray-700 transition-colors ${
                          expandedStakeholderId === stakeholder.id
                            ? 'bg-gray-50 dark:bg-gray-700/30'
                            : ''
                        }`}
                      >
                        <div
                          className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          onClick={() =>
                            setExpandedStakeholderId(
                              expandedStakeholderId === stakeholder.id
                                ? null
                                : stakeholder.id
                            )
                          }
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-3 mb-1">
                                <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                                  {stakeholder.positionRole}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <p
                                  className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-xs md:max-w-sm"
                                  title={stakeholder.name}
                                >
                                  {stakeholder.name}
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

                        {/* Expanded Details Setup */}
                        {expandedStakeholderId === stakeholder.id && (
                          <div className="px-6 pb-5 pt-2 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="col-span-2">
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Name:
                                </p>
                                <p className="font-medium text-base dark:text-gray-200">
                                  {stakeholder.name}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Position / Role:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {stakeholder.positionRole || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Group:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {stakeholder.group || 'N/A'}
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
                                  {stakeholder.classification || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Phase of Most Impact:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {stakeholder.phaseOfMostImpact || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Power / Influence / Interest:
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {stakeholder.power || '-'} /{' '}
                                  {stakeholder.influence || '-'} /{' '}
                                  {stakeholder.interest || '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">
                                  Attitude (Current / Desired):
                                </p>
                                <p className="font-medium dark:text-gray-200">
                                  {stakeholder.currentAttitude || '-'} &rarr;{' '}
                                  {stakeholder.desiredAttitude || '-'}
                                </p>
                              </div>
                              {stakeholder.expectations && (
                                <div className="col-span-2 mt-2">
                                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                                    Expectations:
                                  </p>
                                  <p className="dark:text-gray-200">
                                    {stakeholder.expectations}
                                  </p>
                                </div>
                              )}
                              {stakeholder.requirements && (
                                <div className="col-span-2 mt-2">
                                  <p className="text-gray-500 dark:text-gray-400 mb-1">
                                    Requirements:
                                  </p>
                                  <p className="dark:text-gray-200">
                                    {stakeholder.requirements}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(stakeholder)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      'Are you sure you want to delete this stakeholder?'
                                    )
                                  ) {
                                    deleteStakeholder(stakeholder.id).then(
                                      () => {
                                        fetchStakeholders({ projectId: id });
                                      }
                                    );
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <p>No stakeholders found in this category.</p>
                  <p className="text-sm mt-1">
                    Try a different category or add a new stakeholder.
                  </p>
                </div>
              )}
              {total > 0 && selectedGroup === 'All Stakeholders' && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Showing page {page} of {Math.ceil(total / limit)} (Total:{' '}
                    {total})
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() =>
                        fetchStakeholders({ projectId: id, page: page - 1 })
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= Math.ceil(total / limit)}
                      onClick={() =>
                        fetchStakeholders({ projectId: id, page: page + 1 })
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isFormOpen && id && (
        <StakeholderForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          projectId={id}
          initialData={selectedStakeholder}
        />
      )}

      {isTemplateModalOpen && id && (
        <TemplateModal
          isOpen={isTemplateModalOpen}
          onClose={handleCloseTemplateModal}
          projectId={id}
        />
      )}
    </>
  );
};

export default ProjectDetail;
