import {
  Navbar, NavbarBrand, NavbarContent,
  DropdownItem, DropdownTrigger, Dropdown, DropdownMenu,
  Avatar, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, useDisclosure, Form, Input,
} from "@heroui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizConext";

export default function Navigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isWarnOpen, onOpen: onWarnOpen, onClose: onWarnClose } = useDisclosure();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const navigate = useNavigate();
  const { user, setUser, logout, isQuizActive } = useQuiz();

  const handleProtectedNav = (path: string) => {
    if (isQuizActive) { onWarnOpen(); return; }
    navigate(path);
  };

  const handleLogout = () => {
    if (isQuizActive) { onWarnOpen(); return; }
    logout();
    navigate("/");
  };

  // show the username field we store in user object; fallback to first name
  const displayName = user ? user.username || user.firstname : "User";
  const displayEmail = user?.email ?? "";

  return (
    <>
      <Navbar className="bg-transparent shadow-sm!">
        <NavbarBrand>
          <p className="font-bold text-inherit pl-2 text-blue-700!">MICKQZ</p>
        </NavbarBrand>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end" onOpenChange={(open) => setIsDropdownOpen(open)}>
            <DropdownTrigger className="hover:cursor-pointer">
              <div className="flex items-center gap-2 ">
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform hover:cursor-pointer"
                  color="primary"
                  name={displayName}
                  size="sm"
                />
                <p className="font-semibold text-sm">{displayName}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                  style={{
                    transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                >
                  <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" className="pb-3" variant="flat">
              <DropdownItem key="profile" textValue="profile" className="h-14 gap-2 hover:bg-white!">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold text-xs truncate">{displayEmail}</p>
              </DropdownItem>
              <DropdownItem key="settings" className="hover:text-white! hover:bg-primary! transition-all duration-200" onPress={onOpen}>
                My Account
              </DropdownItem>
              <DropdownItem key="quizzes" className="hover:text-white! hover:bg-primary! transition-all duration-200" onPress={() => handleProtectedNav("/quizzes")}>
                My Quizzes
              </DropdownItem>
              <DropdownItem key="logout" className="hover:text-white! hover:bg-red-600! transition-all duration-200" onPress={handleLogout}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      {/* My Account Modal - pre-filled with user data */}
      <Modal backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">My Account</ModalHeader>
              <ModalBody>
                <Form
                  className="w-full flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
                    if (data.firstname && data.lastname && data.username && data.email) {
                      setUser({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        username: data.username,
                        email: data.email,
                      });
                      onClose();
                    }
                  }}
                >
                  <Input
                    isRequired
                    label="First Name"
                    labelPlacement="outside"
                    name="firstname"
                    defaultValue={user?.firstname ?? ""}
                    placeholder="Enter your first name"
                    type="text"
                  />
                  <Input
                    isRequired
                    label="Last Name"
                    labelPlacement="outside"
                    name="lastname"
                    defaultValue={user?.lastname ?? ""}
                    placeholder="Enter your last name"
                    type="text"
                  />
                  <Input
                    isRequired
                    label="Username"
                    labelPlacement="outside"
                    name="username"
                    defaultValue={user?.username ?? ""}
                    placeholder="Enter your username"
                    type="text"
                  />
                  <Input
                    isRequired
                    label="Email"
                    labelPlacement="outside"
                    name="email"
                    defaultValue={user?.email ?? ""}
                    placeholder="Enter your email"
                    type="email"
                  />
                  <div className="flex gap-2">
                    <Button className="bg-blue-700! text-white!" type="submit">Update</Button>
                    <Button type="reset" variant="flat">Reset</Button>
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-red-600 text-white hover:bg-red-700!" variant="light" onPress={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Active Quiz Warning Modal */}
      <Modal backdrop="blur" isOpen={isWarnOpen} onClose={onWarnClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Quiz In Progress ⚠️</ModalHeader>
              <ModalBody>
                <p className="text-gray-600">You have an active quiz running. Please end the quiz before leaving.</p>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-blue-700 text-white" onPress={onClose}>Continue Quiz</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
