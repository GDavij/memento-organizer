import Modal, { BaseModalProps } from '@/app/components/Modal';
import { User } from '@/models/data/user';
import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import usersService from '@/services/user.service';
import { MdOutlineBackspace } from 'react-icons/md';

type EditSudoModalProps = {
  admin?: User | undefined;
  refetchAdmins: () => Promise<void>;
} & BaseModalProps;
export function EditUserModal({
  open,
  onClose,
  admin,
  refetchAdmins,
}: EditSudoModalProps) {
  const [isUpdatingSudo, setIsUpdatingSudo] = useState(false);
  type TEditSudoFormData = {
    email?: string;
    passphrase?: string;
    confirmPassphrase?: string;
  };

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<TEditSudoFormData>({
      defaultValues: {
        email: '',
        passphrase: '',
        confirmPassphrase: '',
      },
    });

  useEffect(() => {
    reset();
    if (admin) {
      console.log('Update');
      setValue('email', admin.email);
    }
  }, [open]);

  async function editUser(formData: TEditSudoFormData) {
    console.log(formData);
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
    if (!email || email === admin?.email) email = undefined;

    let passphrase = formData.passphrase;
    if (!passphrase) passphrase = undefined;

    setIsUpdatingSudo(true);
    console.log({ email, passphrase });
    try {
      const updateTargetUserRequest = usersService.updateTargetUser(admin!.id, {
        email,
        passphrase,
      });
      toast.promise(updateTargetUserRequest, {
        pending: 'Editing Sudo',
        success: 'Sudo Edited with Sucess',
        error: 'Could not Edit Sudo',
      });
      await updateTargetUserRequest;
      await refetchAdmins();
      setIsUpdatingSudo(false);
      onClose();
      return;
    } catch (er) {}
    setIsUpdatingSudo(false);
  }

  const emailInputId = useId();
  const passphraseInputId = useId();
  const confirmPassphraseInputId = useId();

  return (
    <Modal open={open} onClose={onClose} subject="Update sudo">
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

        <label htmlFor={confirmPassphraseInputId}>
          Confirm Passphrase
          <div className="input-wrapper-left-flat">
            <input
              {...register('confirmPassphrase')}
              type="password"
              id={confirmPassphraseInputId}
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

        <button className="button-flat p-4" disabled={isUpdatingSudo}>
          Edit Sudo
        </button>
      </form>
    </Modal>
  );
}
