import { Icon } from "@iconify/react";
export default function AuthPage() {
    function handleGoogleClick() {
        window.location.href = `https://tmanagment.up.railway.app/api/v1/auth/google`
    }
    function handleTelegramClick() {
        alert("Yasmadinu. Yasab kegin bos!")
    }
    return (
        <section className="w-full h-full relative flex items-center justify-center flex-wrap gap-0 overflow-hidden max-h-screen">
            {Array(400).fill(null).map((_, idx) =>
                <div
                    key={idx}
                    className="w-20 h-20 border border-neutral-50"
                    style={{
                        transition: 'background-color 1000ms linear', // 2s da rang o‘zgaradi
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transitionDelay = '0s'; // hoverda darhol
                        e.currentTarget.style.backgroundColor = 'black';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transitionDelay = '10s'; // 3s kutish
                        e.currentTarget.style.backgroundColor = '';
                    }}
                >

                </div>
            )}
            <div className="w-2/5 border border-neutral-300 h-3/5 absolute top-0 left-0 overflow-hidden bg-white">
                <div className="relative w-full h-full flex pr-3 pb-3">
                    <div className="w-full h-full bg-white flex items-center justify-center relative z-[5] border border-neutral-300">
                        <h1 className="font-black text-7xl">Task</h1>
                    </div>
                    <div className="w-1/2 h-1/2 bg-white flex items-center justify-center absolute shadow-[320px_0_20px_0_rgba(50,203,255,0.9)] animate-spin [animation-duration:2s] top-1/2 left-1/2 -translate-1/2">
                    </div>
                </div>
            </div>
            <div className="w-sm border border-green-50 h-[300px] bg-white z-10 shadow-lg p-5 flex flex-col justify-center gap-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                 transform transition-all duration-500 hover:-translate-2/5  hover:shadow-[-10px_-10px_0_0_rgba(220,220,220,1),-20px_-20px_0_0_rgba(230,230,230,1),-30px_-30px_0_0_rgba(240,240,240,1),-35px_-35px_0_0_rgba(250,250,250,1)] duration-">
                <button
                    onClick={handleGoogleClick}
                    className="w-full bg-white flex items-center justify-center gap-5 shadow py-3 text-sm font-semibold cursor-pointer hover:scale-98 duration-300 hover:bg-black hover:text-white">
                    <Icon icon="logos:google" />
                    Continue with Google
                </button>
                <button
                    onClick={handleTelegramClick}
                    className="w-full bg-white flex items-center justify-center gap-5 shadow py-3 text-sm font-semibold cursor-pointer hover:scale-98 duration-300 hover:bg-black hover:text-white">
                    <Icon icon="logos:telegram" />
                    Continue with Telegram Bot
                </button>
            </div>
            <div className="w-2/5 border border-neutral-300 h-3/5 absolute bottom-0 right-0 overflow-hidden bg-white">
                <div className="relative w-full h-full flex items-end justify-end p-3">
                    <div className="w-full h-full bg-white flex items-center justify-center relative z-[5] border border-neutral-300">
                        <h1 className="font-black text-7xl">Managment</h1>
                    </div>
                    <div className="w-1/2 h-1/2 bg-white flex items-center justify-center absolute shadow-[320px_0_22px_0_rgba(239,116,218,0.9)] animate-spin [animation-duration:900ms] [animation-direction:reverse] top-1/2 left-1/2 -translate-1/2">
                    </div>
                </div>
            </div>
        </section>
    )
}
