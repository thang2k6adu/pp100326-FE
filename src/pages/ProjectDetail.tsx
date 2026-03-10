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
    if (id) fetchStakeholders({ projectId: id }); // Refresh after edit/add
  };

  const handleCloseTemplateModal = () => {
    setIsTemplateModalOpen(false);
    if (id) fetchStakeholders({ projectId: id }); // Refresh after add
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
    { key: 'currentAttitude', header: 'Attitude' },
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
