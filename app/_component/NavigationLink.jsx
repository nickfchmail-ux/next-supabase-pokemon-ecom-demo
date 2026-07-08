"use client";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { CiShop } from 'react-icons/ci';
import { IoHomeOutline } from 'react-icons/io5';
import { LiaUserCogSolid } from 'react-icons/lia';
import { useDispatch } from 'react-redux';
import { setUser } from '../_state/_global/user/userSlice';
import { Modal, Open, Window } from './Modal';
import NavOption from './NavOption';
import SideBar from './SideBar';
function NavigationLink({ view, onClose, user }) {
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);
  const navigation = [
    { path: '/', label: { computer: 'Home', mobile: <IoHomeOutline size="25px" /> } },
    { path: '/about', label: { computer: 'About', mobile: <QuestionMarkIcon /> } },
    { path: '/shop', label: { computer: 'Shop', mobile: <StorefrontIcon /> }, icon: <CiShop /> },
    { path: '/contact', label: { computer: 'Contact', mobile: <MailOutlineIcon /> } },
    { path: '/cart', label: { computer: 'Cart', mobile: <ShoppingCartCheckoutIcon /> } },
    // Admin link — only shown for admin users
    ...(isAdmin
      ? [
          {
            path: '/admin',
            label: {
              computer: (
                <span className="flex items-center gap-1 text-amber-400">
                  <ShieldCheck size={14} />
                  Admin
                </span>
              ),
              mobile: (
                <span className="text-amber-400">
                  <ShieldCheck size="22px" />
                </span>
              ),
            },
          },
        ]
      : []),
    {
      path: '/account',
      label: {
        computer: 'Account',
        mobile: (
          <Modal>
            {user && (
              <Open name={'account'}>
                <button>
                  <LiaUserCogSolid size="22px" />
                </button>
              </Open>
            )}
            <Window name={'account'}>
              <SideBar />
            </Window>
          </Modal>
        ),
      },
    },
  ];

  return (
    <>
      {navigation.map((link, index) => {
        return (
          <NavOption
            key={link.path}
            path={link.path}
            label={link.label}
            index={index}
            totalLenght={navigation.length}
            view={view}
            onClose={onClose}
            user={user}
          />
        );
      })}
    </>
  );
}

export default NavigationLink;
