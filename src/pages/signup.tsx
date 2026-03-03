import Navindex from "@/components/Navindex";
import { Button, Input, Form } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "@/context/QuizConext";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useQuiz();

  return (
    <div className="min-h-screen">
      <Navindex />
      <div className="flex flex-col items-center justify-center px-4 py-10">

        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-black mb-3">Create an <span className="text-blue-700">Account</span></h1>
          <p className="text-gray-600 text-lg">Join MickQz today and start quizzing for free!</p>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg shadow-md">
          <Form
            className="flex flex-col gap-5"
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
                navigate("/welcome");
              }
            }}
          >
            <Input
              isRequired
              label="First Name"
              labelPlacement="outside"
              name="firstname"
              placeholder="Enter your first name"
              type="text"
              errorMessage="First name is required"
            />
            <Input
              isRequired
              label="Last Name"
              labelPlacement="outside"
              name="lastname"
              placeholder="Enter your last name"
              type="text"
              errorMessage="Last name is required"
            />
            <Input
              isRequired
              label="Username"
              labelPlacement="outside"
              name="username"
              placeholder="Choose a username"
              type="text"
              errorMessage="Username is required"
              startContent={<span className="text-gray-400 text-sm">@</span>}
            />
            <Input
              isRequired
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="Enter your email"
              type="email"
              errorMessage="Please enter a valid email"
            />
            <Button type="submit" className="bg-blue-700 text-white w-full mt-2" size="lg">
              Create Account
            </Button>
          </Form>
        </div>

      </div>
    </div>
  );
}
