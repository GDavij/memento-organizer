import Modal, { BaseModalProps } from '@/app/components/Modal';
import { User } from '@/models/data/user';
import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import usersService from '@/services/user.service';
import { MdOutlineBackspace } from 'react-icons/md';

type CreateSudoModalProps = {
  refetchAdmins: () => Promise<void>;
} & BaseModalProps;
export function CreateSudoModal({
  open,
  onClose,
  refetchAdmins,
}: CreateSudoModalProps) {
  const [isCreatingSudo, setIsUpdatingSudo] = useState(false);
  type TCreateSudoFormData = {
    email?: string;
    passphrase?: string;
    confirmPassphrase?: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TCreateSudoFormData>({
    defaultValues: {
      email: '',
      passphrase: '',
      confirmPassphrase: '',
    },
  });

  useEffect(() => {
    reset();
  }, [open]);

  async function editUser(formData: TCreateSudoFormData) {
    if (formData.passphrase != formData.confirmPassphrase) {
      toast.error('Passphrases missmatch');
      return;
    }

    setIsUpdatingSudo(true);
    try {
      const createUserRequest = usersService.createAdmin({
        email: formData.email,
        passphrase: formData.passphrase,
        adminToken: localStorage.getItem('token')!,
      });
      toast.promise(createUserRequest, {
        pending: 'Creating new sudo',
        success: 'Create sudo with success',
        error: 'Could not create sudo',
      });
      await createUserRequest;
      await refetchAdmins();
      setIsUpdatingSudo(false);
      onClose();
    } catch (err) {}
    setIsUpdatingSudo(false);
  }

  const emailInputId = useId();
  const passphraseInputId = useId();
  const confirmPassphraseInputId = useId();
  return (
    <Modal open={open} onClose={onClose} subject="Create sudo">
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(editUser)}
      >
        <label htmlFor={emailInputId}>
          Email
          <div className="input-wrapper-left-flat">
            <input
              {...register('email', { required: true })}
              type="email"
              id={emailInputId}
              className="w-full h-8 bg-transparent p-6 outline-none"
            />
            <span>
              <button
                type="button"
                className="button-flat px-4 py-2"
                onClick={() => setValue('email', '')}
              >
                <MdOutlineBackspace />
              </button>
            </span>
          </div>
          {errors.email?.type === 'required' && (
            <div className="text-red-400">Email is Required</div>
          )}
        </label>
        <label htmlFor={passphraseInputId}>
          Passphrase
          <div className="input-wrapper-left-flat">
            <input
              {...register('passphrase', { required: true, minLength: 16 })}
              type="password"
              id={passphraseInputId}
              className="w-full h-8 bg-transparent p-6 outline-none"
            />
            <span>{watch('passphrase')?.length || 0}</span>
          </div>
          {errors.passphrase?.type === 'required' && (
            <div className="text-red-400">Passphrase is Required</div>
          )}
          {errors.passphrase?.type === 'minLength' && (
            <div className="text-red-400">
              Passphrase must be at least 16 characters
            </div>
          )}
        </label>

        <label htmlFor={confirmPassphraseInputId}>
          Confirm Passphrase
          <div className="input-wrapper-left-flat">
            <input
              {...register('confirmPassphrase', {
                required: true,
                minLength: 16,
              })}
              type="password"
              id={confirmPassphraseInputId}
              className="w-full h-8 bg-transparent p-6 outline-none"
            />
            <span>{watch('confirmPassphrase')?.length || 0}</span>
          </div>
          {errors.confirmPassphrase?.type === 'required' && (
            <div className="text-red-400">Confirm Passphrase is Required</div>
          )}
          {errors.confirmPassphrase?.type === 'minLength' && (
            <div className="text-red-400">
              Confirm Passphrase must be at least 16 characters
            </div>
          )}
        </label>

        <div>
          {(watch('passphrase')?.length || 0) >= 16 &&
            (watch('confirmPassphrase')?.length || 0) >= 16 &&
            watch('passphrase') != watch('confirmPassphrase') && (
              <div className="text-red-400">Passphrases missmatch</div>
            )}
          {(watch('passphrase')?.length || 0) >= 16 &&
            (watch('confirmPassphrase')?.length || 0) >= 16 &&
            watch('passphrase') === watch('confirmPassphrase') && (
              <div className="text-green-400">Passphrases match</div>
            )}
        </div>

        <button className="button-flat p-4" disabled={isCreatingSudo}>
          Create New Sudo
        </button>
      </form>
    </Modal>
  );
}
