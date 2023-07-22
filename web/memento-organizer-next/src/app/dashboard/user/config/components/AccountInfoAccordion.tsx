import { Accordion } from '@/app/components/Acordion';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { TUpdateUserRequest } from '@/models/requests/userRequests';
import userService from '@/services/user.service';
import { AxiosError } from 'axios';
import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type AccountInfoAccordionProps = {
  fetchedEmail: string | undefined;
  refetchUserData: () => Promise<void>;
};
export default function AccountInfoAccordion({
  fetchedEmail,
  refetchUserData,
}: AccountInfoAccordionProps) {
  const [open, setOpen] = useState(true);
  const [openEmailConfirmation, setOpenEmailConfirmation] = useState(false);
  const [openPassphraseConfirmation, setOpenPassphraseConfirmation] =
    useState(false);

  const emailForm = useForm<{ email: string }>({
    defaultValues: {
      email: '',
    },
  });
  const passphraseForm = useForm<{
    passphrase: string;
    confirmPassphrase: string;
  }>({ defaultValues: { passphrase: '', confirmPassphrase: '' } });

  const emailId = useId();
  const passphraseId = useId();
  const confirmPassphraseId = useId();

  useEffect(() => {
    emailForm.setValue('email', fetchedEmail || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedEmail]);

  return (
    <>
      <Accordion
        open={open}
        closeOpen={() => setOpen((prev) => !prev)}
        subject="Account Data"
        height="h-[38rem] md:h-[20rem]"
      >
        <form
          onSubmit={emailForm.handleSubmit((data) => {
            setOpenEmailConfirmation(true);
          })}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <label
            htmlFor={emailId}
            className="w-full md:w-[73.5%] flex flex-col flex-shrink flex-grow-0"
          >
            <span>Email</span>
            <input
              id={emailId}
              {...emailForm.register('email', { required: true })}
              type="email"
              className="input-flat"
            />
          </label>
          <div className="w-full md:w-[30%]">
            <button
              type="submit"
              className="p-4 h-12 button-flat w-full md:translate-y-1/4"
            >
              Edit Email
            </button>
          </div>
        </form>
        <section className="flex flex-col text-red-400">
          <div>
            {emailForm.formState.errors.email?.type == 'required' &&
              'Email is Required'}
          </div>
          <div>
            {emailForm.formState.errors.email?.type == 'validate' &&
              'Email is not valid'}
          </div>
        </section>

        <hr className="w-full h-0.5 bg-slate-200 dark:bg-slate-600 border-0 rounded-3xl my-8" />
        <form
          onSubmit={passphraseForm.handleSubmit((data) => {
            if (
              passphraseForm.getValues('passphrase') !=
              passphraseForm.getValues('confirmPassphrase')
            ) {
              toast.error('Passphrases Do not Match');
              return;
            }
            setOpenPassphraseConfirmation(true);
          })}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <label
            htmlFor={passphraseId}
            className="w-full md:w-[35%] flex flex-col flex-shrink flex-grow-0"
          >
            <span>Passphrase</span>
            <div className="input-wrapper-left-flat">
              <input
                id={passphraseId}
                {...passphraseForm.register('passphrase', {
                  required: true,
                  minLength: 16,
                })}
                type="password"
                className="w-full h-8 bg-transparent p-6 outline-none"
              />
              <span>{passphraseForm.watch('passphrase')?.length || 0}</span>
            </div>
          </label>
          <label
            htmlFor={confirmPassphraseId}
            className="w-full md:w-[35%] flex flex-col flex-shrink flex-grow-0"
          >
            <span>Confirm Passphrase</span>
            <div className="input-wrapper-left-flat">
              <input
                id={confirmPassphraseId}
                {...passphraseForm.register('confirmPassphrase', {
                  required: true,
                  minLength: 16,
                })}
                type="password"
                className="w-full h-8 bg-transparent p-6 outline-none"
              />
              <span>
                {passphraseForm.watch('confirmPassphrase')?.length || 0}
              </span>
            </div>
          </label>
          <div className="w-full md:w-[30%]">
            <button
              type="submit"
              className="p-4 h-12 button-flat w-full md:translate-y-1/4"
            >
              Edit Passphrase
            </button>
          </div>
        </form>
        <section className="flex flex-col text-red-400">
          <div>
            {passphraseForm.formState.errors.passphrase?.type == 'required' &&
              'Passphrase is Required'}
          </div>
          <div>
            {passphraseForm.formState.errors.passphrase?.type == 'minLength' &&
              'Passphrase Length Must be higher than 16 characters'}
          </div>
          <div>
            {passphraseForm.formState.errors.confirmPassphrase?.type ==
              'required' && 'Confirm Passphrase is Required'}
          </div>
          <div>
            {passphraseForm.formState.errors.confirmPassphrase?.type ==
              'minLength' &&
              'Confirm Passphrase Length Must be higher than 16 characters'}
          </div>
          <div>
            {passphraseForm.watch('passphrase').length >= 16 &&
              passphraseForm.watch('confirmPassphrase').length >= 16 &&
              passphraseForm.watch('passphrase') !=
                passphraseForm.watch('confirmPassphrase') &&
              'Passphrases Missmatch'}
          </div>
        </section>
      </Accordion>

      <ConfirmDialog
        onClose={() => setOpenEmailConfirmation(false)}
        open={openEmailConfirmation}
        onOkay={async () => {
          const emailData = emailForm.getValues('email');
          const filteredBody: TUpdateUserRequest = {
            email: emailData,
          };

          try {
            await userService.updateUser(filteredBody);
            await refetchUserData();
            toast.success(`Successed update your Email to ${emailData}`);
          } catch (e: any) {
            toast.error(e.response.data.detail);
          }
        }}
        question={'Are you Sure about update your email?'}
        declineButtonContent={'No, Close'}
        okayButtonContent={'Yes, update'}
        title="Confirm Warning"
      />

      <ConfirmDialog
        onClose={() => setOpenPassphraseConfirmation(false)}
        open={openPassphraseConfirmation}
        onOkay={async () => {
          const passphraseData = passphraseForm.getValues('passphrase');
          const filteredBody: TUpdateUserRequest = {
            passphrase: passphraseData,
          };

          try {
            const newToken = await userService.updateUser(filteredBody);
            localStorage.setItem('token', newToken);
            await refetchUserData();
            toast.success(`Successed update your Passphrase`);
            passphraseForm.reset();
          } catch (e: any) {
            toast.error(e.response.data.detail);
          }
        }}
        question={'Are you Sure about update your Passphrase?'}
        declineButtonContent={'No, Close'}
        okayButtonContent={'Yes, update'}
        title="Confirm Warning"
      />
    </>
  );
}
