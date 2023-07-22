'use client';

import { useEffect, useState } from 'react';
import { useTopBar } from '../../contexts/useTopBar';
import usersService from '@/services/user.service';
import { User } from '@/models/data/user';
import { ToastContainer, toast } from 'react-toastify';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import { EditUserModal } from './components/EditAdminModal';
import { CreateSudoModal } from './components/CreateAdminModal';
export default function Admin() {
  const [
    openDeleteUserConfirmationDialog,
    setOpenDeleteUserConfirmationDialog,
  ] = useState(false);
  const [openEditUserModal, setOpenEditUserModal] = useState(false);
  const [openCreateSudoModal, setOpenCreateSudoModal] = useState(false);

  const [userSelected, setUserSelected] = useState<User>();
  const { setPageDetails } = useTopBar();
  const [admins, setUsers] = useState<User[]>([]);
  const [actualAdmin, setActualAdmin] = useState<User>();
  async function getAdmins() {
    const listUsersRequest = usersService.listAllAdmins();
    toast.promise(listUsersRequest, {
      pending: 'Listing Sudos',
      success: 'Sudos Listed with Sucess',
      error: 'Could not List Sudos',
    });
    const users = await listUsersRequest;
    setUsers(users);
  }

  async function getAdmin() {
    try {
      const actualAdmin = await usersService.findUser();
      setActualAdmin(actualAdmin);
      console.log(actualAdmin);
    } catch (err) {}
  }

  useEffect(() => {
    setPageDetails({
      pageName: 'Users',
    });
    getAdmin();
    getAdmins();
  }, []);

  return (
    <>
      <div className="card-container mb-4">
        <div className="flex justify-center">
          <h1 className="text-4xl w-full justify-end flex">List of Sudos</h1>
          <div className="w-[68%] flex justify-end items-top">
            <button
              className="button-flat px-4 py-2"
              onClick={() => {
                setUserSelected(undefined);
                setOpenCreateSudoModal(true);
              }}
            >
              Create new Sudo
            </button>
          </div>
        </div>
      </div>
      <div className="card-container overflow-auto min-h-full">
        <table>
          <thead>
            <tr>
              <th className="whitespace-nowrap">Email</th>
              <th className="whitespace-nowrap">Issued</th>
              <th className="whitespace-nowrap">Last Login</th>
              <th className="whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr
                className="border-y border-emerald-500 even:bg-emerald-50 dark:even:bg-emerald-900"
                key={admin.email}
              >
                <td className="whitespace-nowrap py-2  px-8 text-center ">
                  {admin.email}
                </td>
                <td className="whitespace-nowrap py-2  px-8 text-center">
                  {admin.issued}
                </td>
                <td className="whitespace-nowrap py-2  px-8 text-center">
                  {admin.lastLogin}
                </td>
                <td className="whitespace-nowrap py-2  px-8 text-center flex justify-center gap-4">
                  {admin.email === actualAdmin?.email ? (
                    <div className="px-4 py-2">
                      Nothing to do with your user
                    </div>
                  ) : (
                    <>
                      <button
                        className="button-danger-flat px-4 py-2"
                        onClick={() => {
                          setUserSelected(admin);
                          setOpenDeleteUserConfirmationDialog(true);
                        }}
                      >
                        <MdDelete />
                      </button>
                      <button
                        className="button-warning-flat px-4 py-2"
                        onClick={() => {
                          setUserSelected(admin);
                          setOpenEditUserModal(true);
                        }}
                      >
                        <MdEditSquare />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmDialog
        open={openDeleteUserConfirmationDialog}
        onOkay={async () => {
          if (!userSelected) {
            toast.error('User Could not be selected');
            return;
          }

          const sudoDeleteUserRequest = usersService.deleteTargetUser(
            userSelected.id
          );
          toast.promise(sudoDeleteUserRequest, {
            pending: `Deleting user ${userSelected.email}`,
            error: `Could not delete user ${userSelected.email}`,
            success: `Delete user ${userSelected.email} with success`,
          });
          await sudoDeleteUserRequest;
          await getAdmins();
          setUserSelected(undefined);
          setOpenDeleteUserConfirmationDialog(false);
        }}
        onClose={() => setOpenDeleteUserConfirmationDialog(false)}
        title="Delete User"
        question={`Are you sure about deleting user ${userSelected?.email}`}
        okayButtonContent="Yes, Delete"
        declineButtonContent="No, Cancel"
      />
      <EditUserModal
        open={openEditUserModal}
        onClose={() => setOpenEditUserModal(false)}
        admin={userSelected}
        refetchAdmins={getAdmins}
      />
      <CreateSudoModal
        open={openCreateSudoModal}
        onClose={() => setOpenCreateSudoModal(false)}
        refetchAdmins={getAdmins}
      />
      <ToastContainer />
    </>
  );
}
