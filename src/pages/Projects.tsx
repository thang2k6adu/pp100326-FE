import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import Card from '@/components/Card';
import ProjectFormModal from '@/components/ProjectFormModal';
import { ROUTES } from '@/constants';
import { CreateProjectData } from '@/types/project';
import { createProjectThunk } from '@/store/thunks/projectThunks';

const Projects: React.FC = () => {
  const { projects, isLoading, fetchProjects, createProject, deleteProject } =
    useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async (data: CreateProjectData) => {
    const result = await createProject(data);
    if (createProjectThunk.fulfilled.match(result)) {
      navigate(ROUTES.PROJECTS + '/' + result.payload.data.id);
    }
  };

  return (
    <>
      <Helmet>
        <title>Projects - StakeholderHub</title>
        <meta name="description" content="Manage your projects" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Projects
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your stakeholder analysis projects.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 font-bold text-white rounded bg-primary-600 hover:bg-primary-700"
          >
            + New Project
          </button>
        </div>

        {isLoading && projects.length === 0 ? (
          <div>Loading projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => navigate(ROUTES.PROJECTS + '/' + project.id)}
                className="cursor-pointer transition-transform transform hover:scale-105 relative group"
              >
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        'Are you sure you want to delete this project?'
                      )
                    ) {
                      deleteProject(project.id).then(() => fetchProjects());
                    }
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-2"
                  title="Delete Project"
                >
                  ✕
                </button>
                <Card title={project.name} hover>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-3">
                    {project.description || 'No description provided.'}
                  </p>
                  <p className="text-xs text-gray-400 mt-4">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="col-span-3 py-10 text-center text-gray-500">
                You do not have any projects yet. Create one to get started!
              </div>
            )}
          </div>
        )}
      </div>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  );
};

export default Projects;
