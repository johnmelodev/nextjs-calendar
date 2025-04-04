'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  Calendar as CalendarIcon,
  CalendarCheck as CalendarCheckIcon,
  MapPin as MapPinIcon,
  Users as UsersIcon,
  Briefcase as BriefcaseIcon,
  UserCircle as UserCircleIcon,
  CaretDown,
  SignOut
} from '@phosphor-icons/react';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { name: 'Calendário', href: '/', icon: CalendarIcon },
    { name: 'Agendamentos', href: '/agendamentos', icon: CalendarCheckIcon },
    { name: 'Serviços', href: '/servicos', icon: BriefcaseIcon },
    { name: 'Locais', href: '/locais', icon: MapPinIcon },
    { name: 'Profissionais', href: '/profissionais', icon: UsersIcon },
    { name: 'Pacientes', href: '/pacientes', icon: UserCircleIcon },
  ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-[72px]">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  src="/logohello.svg"
                  alt="HelloDoc"
                  width={100}
                  height={32}
                  className="h-6 w-auto"
                />
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-violet-500 text-gray-900 border-b-2'
                        : 'text-gray-500 hover:border-gray-300 hover:text-gray-700 border-b-2 border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" weight="regular" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 hover:opacity-80">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-violet-400">
                  <span className="text-white">DM</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700">Diego Menezes</span>
                  <CaretDown className="w-4 h-4 ml-2 text-gray-500" weight="bold" />
                </div>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700`}
                          onClick={() => {
                            // Função de logout será implementada posteriormente
                            console.log('Logout clicked');
                          }}
                        >
                          <SignOut
                            className="mr-2 h-5 w-5"
                            weight="regular"
                          />
                          Sair
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
} 