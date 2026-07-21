import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const loginMock = jest.fn();
const navigateMock = jest.fn();
const setUserMock = jest.fn();
const useAuthMock = jest.fn();

jest.unstable_mockModule("../../src/api/authApi.js", () => ({
  login: loginMock,
}));

jest.unstable_mockModule("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

jest.unstable_mockModule("../../src/hooks/useAuth.js", () => ({
  useAuth: useAuthMock,
}));

const { default : LoginPage } = await import("../../src/pages/loginPage.jsx");

describe("LoginPage", () => {
    beforeEach(() => {
        jest.resetAllMocks();

        useAuthMock.mockReturnValue({
            setUser: setUserMock
        })
    })

    test("renders login form fields and button", () => {

        render(<LoginPage/>)

        expect(screen.getByRole("heading",{ name: "Sign in"})).toBeInTheDocument();
        expect(screen.getByLabelText("Email")).toBeInTheDocument();
        expect(screen.getByLabelText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button",{ name: "Login" })).toBeInTheDocument();
    })

    test("logs in, saves user in context, and navigates to dashboard", async () => {
        const user = userEvent.setup();
        const loggedInUser = {
            user_id: 1,
            fullName: "Admin User"
        }
        loginMock.mockResolvedValue({
            user: loggedInUser
        })

        render(<LoginPage/>);

        await user.type(screen.getByLabelText("Email"),"admin@example.com");
        await user.type(screen.getByLabelText("Password"),"password123");
        await user.click(screen.getByRole("button",{ name: "Login" }));

   
             
            await waitFor(() => {
            expect(loginMock).toHaveBeenCalledWith({
                email: "admin@example.com",
                password: "password123",
            })
            })
           

        expect(setUserMock).toHaveBeenCalledWith(loggedInUser);
        expect(navigateMock).toHaveBeenCalledWith("/dashboard")
    })

    test("shows API error message and does not navigate when login fails", async () => {
    // Arrange
    const user = userEvent.setup();

    loginMock.mockRejectedValue({
      message: "Invalid credentials",
    });

    render(<LoginPage />);

    // Act
    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    // Assert
    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();

    expect(setUserMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  test("shows fallback error when API error has no message", async () => {
    // Arrange
    const user = userEvent.setup();

    loginMock.mockRejectedValue({});

    render(<LoginPage />);

    // Act
    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    // Assert
    expect(await screen.findByText("Login failed")).toBeInTheDocument();
  });

  test("shows loading state while login request is in progress", async () => {
    const user = userEvent.setup();

    let resolvedLogin;

    loginMock.mockImplementation(() => {
        return new Promise((resolve) => {
            resolvedLogin = resolve;
        })
    })

    render(<LoginPage/>)

    await user.type(screen.getByLabelText("Email"), "admin@example.com");
    await user.type(screen.getByLabelText("Password"), "password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(screen.getByRole("button",{
        name:"Signing in..."
    })).toBeDisabled();

    resolvedLogin({
        user: {
      user_id: 1,
      fullName: "Admin User",
        },
    })

    await waitFor(() => {
        expect(screen.getByRole("button",{ name: "Login"})).toBeEnabled();
    })
  })
})