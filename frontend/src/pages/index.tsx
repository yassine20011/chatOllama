import OllamaSvg from '@/assets/ollama.svg'
import { Button } from '../components/ui/button'


function Index() {
    return (<>
        <div className="flex min-h-full w-screen flex-col sm:supports-[min-height:100dvh]:min-h-[100dvh] md:grid md:grid-cols-2 lg:grid-cols-[60%_40%]">
            <div className="relative hidden flex-1 flex-col justify-center px-5 pt-8 text-[#FE7600] dark:text-[#D292FF] md:flex md:px-6 md:py-[22px] lg:px-8 bg-black">
                <nav className="left-0 top-8 flex w-full px-6 sm:absolute md:top-[22px] md:px-6 lg:px-8">
                    <h1 aria-label="ChatGPT by OpenAI">
                        <div className="flex cursor-default items-center text-[20px] font-bold leading-none lg:text-[22px]">
                            <div>
                                ChatOllama <span className="font-circle">●</span>
                            </div>
                        </div>
                    </h1>
                </nav>
                <div
                    className="flex flex-col text-[32px] leading-[1.2] md:text-[40px]"
                    aria-hidden="true"
                >
                    <div
                        className="-mt-4 flex w-full flex-col pr-5 md:pr-8 lg:pr-10"
                        style={{ opacity: 1, willChange: "auto", transform: "none" }}
                    >
                        <p className="font-bold">
                            ChatOllama
                            <span className="font-circle">​●</span>
                        </p>
                        <p className="font-normal">
                            A platform for chatting with AI
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative flex grow flex-col items-center justify-between bg-white px-5 py-8 text-black dark:bg-black dark:text-white sm:rounded-t-[30px] md:rounded-none md:px-6 bg-gradient-to-b from-[#FE7600] to-[#F0A500] md:flex md:py-8 lg:px-8">
                <nav className="flex w-full justify-start px-6 pb-8 md:hidden md:px-6 lg:px-8">
                    <h1 aria-label="ChatGPT by OpenAI">
                        <div className="flex cursor-default items-center text-[20px] font-bold leading-none lg:text-[22px]">
                            <div>
                                ChatOllama <span className="font-circle">●</span>
                            </div>
                        </div>
                    </h1>
                </nav>
                <div className="relative flex w-full grow flex-col items-center justify-center">
                    <h2 className="text-center text-[20px] leading-[1.2] md:text-[32px] md:leading-8">
                        Get started
                    </h2>
                    <div className="mt-5 w-full max-w-[440px]">
                        <div className="grid gap-x-3 gap-y-2 sm:grid-cols-2 sm:gap-y-0">
                            <Button
                                className="btn relative btn-blue btn-large"
                            >
                                <div className="flex items-center justify-center">
                                    <span>Login</span>
                                </div>
                            </Button>
                            <Button
                                className="btn relative btn-ghost btn-large"
                            >
                                <div className="flex items-center justify-center">
                                    <span>Sign up</span>
                                </div>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="mt-10 flex flex-col justify-center">
                    <div className="flex justify-center text-gray-300 md:mb-3">
                        <img
                            src={OllamaSvg}
                            alt="Ollama"
                            className="w-14 h-14"
                        />
                    </div>
                    <div className="flex gap-3 py-3 text-xs text-token-text-tertiary">
                        <a
                            rel="noopener"
                            className="cursor-pointer font-normal underline"
                            target="_blank"
                            href="#"
                        >
                            Terms of use
                        </a>
                        <span className="text-token-text-tertiary">|</span>
                        <a
                            rel="noopener"
                            className="cursor-pointer font-normal underline"
                            target="_blank"
                            href="#"
                        >
                            Privacy policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </>);
}

export default Index;