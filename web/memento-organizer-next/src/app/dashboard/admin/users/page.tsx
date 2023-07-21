'use client';

import { useEffect, useState } from 'react';
import { useTopBar } from '../../contexts/useTopBar';
import usersService from '@/services/user.service';
import { User } from '@/models/data/user';
import { ToastContainer, toast } from 'react-toastify';
import { MdDelete, MdEditSquare } from 'react-icons/md';
import ConfirmDialog from '@/app/components/ConfirmDialog';
export default function Admin() {
  const [
    openDeleteUserConfirmationDialog,
    setOpenDeleteUserConfirmationDialog,
  ] = useState(false);
  const [userSelected, setUserSelected] = useState<User>();
  const { setPageDetails } = useTopBar();
  const [users, setUsers] = useState<User[]>([]);

  async function getUsers() {
    const listUsersRequest = usersService.listAllUsers();
    toast.promise(listUsersRequest, {
      pending: 'Listing Users',
      success: 'Users Listed with Sucess',
      error: 'Could not List Users',
    });
    const users = await listUsersRequest;
    setUsers(users);
  }

  useEffect(() => {
    setPageDetails({
      pageName: 'Users',
    });

    getUsers();
  }, []);

  return (
    <>
      <div className="card-container mb-4">
        <h1 className="text-4xl text-center">List of Users</h1>
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
            {users.map((user) => (
              <tr
                className="border-y border-emerald-500 even:bg-emerald-50 dark:even:bg-emerald-900"
                key={user.email}
              >
                <td className="whitespace-nowrap py-2  px-8 text-center ">
                  {user.email}
                </td>
                <td className="whitespace-nowrap py-2  px-8 text-center">
                  {user.issued}
                </td>
                <td className="whitespace-nowrap py-2  px-8 text-center">
                  {user.lastLogin}
                </td>
                <td className="whitespace-nowrap py-2  px-8 text-center flex justify-center gap-4">
                  <button
                    className="button-danger-flat px-4 py-2"
                    onClick={() => {
                      setUserSelected(user);
                      setOpenDeleteUserConfirmationDialog(true);
                    }}
                  >
                    <MdDelete />
                  </button>
                  <button className="button-warning-flat px-4 py-2">
                    <MdEditSquare />
                  </button>
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
          await getUsers();
          setUserSelected(undefined);
          setOpenDeleteUserConfirmationDialog(false);
        }}
        onClose={() => setOpenDeleteUserConfirmationDialog(false)}
        title="Delete User"
        question={`Are you sure about deleting user ${userSelected?.email}`}
        okayButtonContent="Yes, Delete"
        declineButtonContent="No, Cancel"
      />
      <ToastContainer />
    </>
  );
}
