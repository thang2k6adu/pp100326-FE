import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Helmet } from 'react-helmet-async';
import Table from '@/components/Table';
import Button from '@/components/Button';
import { Stakeholder } from '@/types/stakeholder';
import StakeholderForm from '@/components/StakeholderForm';
import TemplateModal from '@/components/TemplateModal';

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
    isLoading: isStakeholdersLoading,
  } = useStakeholders();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<
    Stakeholder | undefined
  >();

  // Filter states
  const [classification, setClassification] = useState('');
  const [power, setPower] = useState('');
  const [interest, setInterest] = useState('');
  const [influence, setInfluence] = useState('');
  const [currentAttitude, setCurrentAttitude] = useState('');
  const [desiredAttitude, setDesiredAttitude] = useState('');

  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchStakeholders({
        projectId: id,
        ...(classification && { classification }),
        ...(power && { power }),
        ...(interest && { interest }),
        ...(influence && { influence }),
        ...(currentAttitude && { currentAttitude }),
        ...(desiredAttitude && { desiredAttitude }),
      });
    }
  }, [
    id,
    fetchProjectById,
    fetchStakeholders,
    classification,
    power,
    interest,
    influence,
    currentAttitude,
    desiredAttitude,
  ]);

  const handleEdit = (stakeholder: Stakeholder) => {
    setSelectedStakeholder(stakeholder);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedStakeholder(undefined);
    setIsFormOpen(false);
    if (id) {
      fetchStakeholders({
        projectId: id,
        ...(classification && { classification }),
        ...(power && { power }),
        ...(interest && { interest }),
        ...(influence && { influence }),
        ...(currentAttitude && { currentAttitude }),
        ...(desiredAttitude && { desiredAttitude }),
      });
    }
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    if (id) {
      fetchStakeholders({
        projectId: id,
        ...(classification && { classification }),
        ...(power && { power }),
        ...(interest && { interest }),
        ...(influence && { influence }),
        ...(currentAttitude && { currentAttitude }),
        ...(desiredAttitude && { desiredAttitude }),
      });
    }
  };

  const handleResetFilters = () => {
    setClassification('');
    setPower('');
    setInterest('');
    setInfluence('');
    setCurrentAttitude('');
    setDesiredAttitude('');
  };

  if (isProjectLoading || !currentProject) {
    return <div>Loading project details...</div>;
  }

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'positionRole', header: 'Role/Position' },
    { key: 'classification', header: 'Classification' },
    { key: 'power', header: 'Power/Impact' },
    { key: 'interest', header: 'Interest' },
    { key: 'influence', header: 'Influence' },
    { key: 'currentAttitude', header: 'Current Attitude' },
    { key: 'desiredAttitude', header: 'Desired Attitude' },
    {
      key: 'actions',
      header: 'Actions',
      render: (stakeholder: Stakeholder) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(stakeholder)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const dataRows = stakeholders.map(s => ({
    ...s,
    id: s.id,
  }));

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

          {/* Filters Section */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Classification
                </label>
                <select
                  value={classification}
                  onChange={e => setClassification(e.target.value)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="Internal">Internal</option>
                  <option value="External">External</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Power
                </label>
                <select
                  value={power}
                  onChange={e => setPower(e.target.value)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Interest
                </label>
                <select
                  value={interest}
                  onChange={e => setInterest(e.target.value)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Influence
                </label>
                <select
                  value={influence}
                  onChange={e => setInfluence(e.target.value)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Attitude
                </label>
                <select
                  value={currentAttitude}
                  onChange={e => setCurrentAttitude(e.target.value)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="Leading">Leading</option>
                  <option value="Supportive">Supportive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Resistant">Resistant</option>
                  <option value="Unaware">Unaware</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Desired Attitude
                </label>
                <select
                  value={desiredAttitude}
                  onChange={e => setDesiredAttitude(e.target.value)}
                  className="w-full text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:bg-gray-800 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="Leading">Leading</option>
                  <option value="Supportive">Supportive</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Resistant">Resistant</option>
                  <option value="Unaware">Unaware</option>
                </select>
              </div>
            </div>

            {(classification ||
              power ||
              interest ||
              influence ||
              currentAttitude ||
              desiredAttitude) && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {isStakeholdersLoading ? (
            <p>Loading stakeholders...</p>
          ) : stakeholders.length > 0 ? (
            <Table data={dataRows} columns={columns} />
          ) : (
            <p className="text-gray-500">
              No stakeholders found. Add one or import from the templates
              library.
            </p>
          )}
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
