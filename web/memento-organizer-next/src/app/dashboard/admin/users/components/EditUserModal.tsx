import Modal, { BaseModalProps } from '@/app/components/Modal';
import { User } from '@/models/data/user';
import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import usersService from '@/services/user.service';
import { MdOutlineBackspace } from 'react-icons/md';

type EditUserModalProps = {
  user?: User | undefined;
  refetchUsers: () => Promise<void>;
} & BaseModalProps;
export function EditUserModal({
  open,
  onClose,
  user,
  refetchUsers,
}: EditUserModalProps) {
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  type TEditUserFormData = {
    email?: string;
    passphrase?: string;
    confirmPassphrase?: string;
  };

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<TEditUserFormData>({
      defaultValues: {
        email: '',
        passphrase: '',
        confirmPassphrase: '',
      },
    });

  useEffect(() => {
    reset();
    if (user) {
      setValue('email', user.email);
    }
  }, [open]);

  async function editUser(formData: TEditUserFormData) {
    if (formData.passphrase && formData.passphrase.length < 16) {
      toast.error('Passphrase has less than 16 characters');
      return;
    }

    if (formData.confirmPassphrase && formData.confirmPassphrase.length < 16) {
      toast.error('Confirm Passphrase has less than 16 characters');
      return;
    }

    if (formData.passphrase != formData.confirmPassphrase) {
      toast.error('Passphrases missmatch');
      return;
    }

    let email = formData.email;
    if (!email || email === user?.email) email = undefined;

    let passphrase = formData.passphrase;
    if (!passphrase) passphrase = undefined;

    setIsUpdatingUser(true);
    try {
      const updateTargetUserRequest = usersService.updateTargetUser(user!.id, {
        email,
        passphrase,
      });
      toast.promise(updateTargetUserRequest, {
        pending: 'Editing User',
        success: 'User Edited with Sucess',
        error: 'Could not Edit User',
      });
      await updateTargetUserRequest;
      await refetchUsers();
      setIsUpdatingUser(false);
      onClose();
      return;
    } catch (er) {}
    setIsUpdatingUser(false);
  }

  const emailInputId = useId();
  const passphraseInputId = useId();

  return (
    <Modal open={open} onClose={onClose} subject="Update User">
      <form
        className="flex flex-col gap-4 w-full"
        onSubmit={handleSubmit(editUser)}
      >
        <label htmlFor={emailInputId}>
          Email
          <div className="input-wrapper-left-flat">
            <input
              {...register('email')}
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
        </label>
        <label htmlFor={passphraseInputId}>
          Passphrase
          <div className="input-wrapper-left-flat">
            <input
              {...register('passphrase')}
              type="password"
              id={passphraseInputId}
              className="w-full h-8 bg-transparent p-6 outline-none"
            />
            <span>{watch('passphrase')?.length || 0}</span>
          </div>
        </label>

        <label htmlFor={passphraseInputId}>
          Confirm Passphrase
          <div className="input-wrapper-left-flat">
            <input
              {...register('confirmPassphrase')}
              type="password"
              id={passphraseInputId}
              className="w-full h-8 bg-transparent p-6 outline-none"
            />
            <span>{watch('confirmPassphrase')?.length || 0}</span>
          </div>
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

        <button className="button-flat p-4" disabled={isUpdatingUser}>
          Edit User
        </button>
      </form>
    </Modal>
  );
}
