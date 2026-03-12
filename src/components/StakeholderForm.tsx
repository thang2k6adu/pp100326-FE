import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateStakeholderData, Stakeholder } from '@/types/stakeholder';
import { useStakeholders } from '@/hooks/useStakeholders';

interface StakeholderFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  initialData?: Stakeholder;
}

const StakeholderForm: React.FC<StakeholderFormProps> = ({
  isOpen,
  onClose,
  projectId,
  initialData,
}) => {
  const { createStakeholder, updateStakeholder } = useStakeholders();
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<CreateStakeholderData>({
      defaultValues: initialData
        ? { ...initialData, projectId }
        : { projectId },
    });

  const power = watch('power');
  const influence = watch('influence');
  const interest = watch('interest');

  useEffect(() => {
    if (power || influence || interest) {
      const getVal = (level: string | undefined) => {
        if (level === 'High') return 3;
        if (level === 'Medium') return 2;
        if (level === 'Low') return 1;
        return 0;
      };
      const p = getVal(power);
      const inf = getVal(influence);
      const int = getVal(interest);
      setValue('score', p * 3 + inf * 2 + int * 1);
    }
  }, [power, influence, interest, setValue]);

  useEffect(() => {
    if (isOpen) {
      reset(initialData ? { ...initialData, projectId } : { projectId });
    }
  }, [isOpen, initialData, projectId, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CreateStakeholderData) => {
    // Strip identifying/extra fields to avoid backend validation errors on update
    // Using destructuring to remove extra fields
    const payload = { ...initialData, ...data };
    delete (payload as unknown as Record<string, unknown>).id;
    delete (payload as unknown as Record<string, unknown>).createdAt;
    delete (payload as unknown as Record<string, unknown>).updatedAt;
    delete (payload as unknown as Record<string, unknown>).deletedAt;
    delete (payload as unknown as Record<string, unknown>).project;
    delete (payload as unknown as Record<string, unknown>).projectId;

    if (initialData) {
      // Re-add projectId if needed by the backend schema for update
      await updateStakeholder(
        initialData.id,
        payload as Partial<CreateStakeholderData>
      );
    } else {
      await createStakeholder(data);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-gray-800">
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {initialData ? 'Edit Stakeholder' : 'Add Stakeholder'}
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="relative flex-auto p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name *
                  </label>
                  <input
                    required
                    {...register('name')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Role/Position
                  </label>
                  <input
                    {...register('positionRole')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Contact Info
                  </label>
                  <input
                    {...register('contactInformation')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Classification
                  </label>
                  <select
                    {...register('classification')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Power (Impact)
                  </label>
                  <select
                    {...register('power')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Interest
                  </label>
                  <select
                    {...register('interest')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Current Attitude
                  </label>
                  <select
                    {...register('currentAttitude')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Leading">Leading</option>
                    <option value="Supportive">Supportive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Resistant">Resistant</option>
                    <option value="Unaware">Unaware</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Desired Attitude
                  </label>
                  <select
                    {...register('desiredAttitude')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="Leading">Leading</option>
                    <option value="Supportive">Supportive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Resistant">Resistant</option>
                    <option value="Unaware">Unaware</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Influence
                  </label>
                  <select
                    {...register('influence')}
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  >
                    <option value="">Select...</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    {...register('score', { valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border rounded shadow focus:outline-none dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600 cursor-not-allowed"
                    placeholder="Auto-calculated"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Requirements
                </label>
                <textarea
                  {...register('requirements')}
                  rows={2}
                  className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Expectations
                </label>
                <textarea
                  {...register('expectations')}
                  rows={2}
                  className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Phase of Most Impact
                </label>
                <input
                  {...register('phaseOfMostImpact')}
                  placeholder="e.g. Planning, Executing"
                  className="w-full px-3 py-2 text-sm text-gray-700 border rounded shadow focus:outline-none focus:ring focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200 dark:border-gray-700">
              <button
                className="px-6 py-2 mb-1 mr-1 text-sm font-bold text-gray-500 uppercase transition-all duration-150 ease-linear outline-none background-transparent focus:outline-none"
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none bg-primary-600 hover:bg-primary-700 focus:outline-none hover:shadow-lg"
                type="submit"
              >
                {initialData ? 'Save Changes' : 'Add Stakeholder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StakeholderForm;
