import type { stageType } from '@/types/types'

export default function StageButton({ stage }: { stage: stageType }) {
    return (
        <button
            className={`
    flex items-center justify-center
    w-4 h-4 overflow-hidden rounded-full p-0 border aspect-square
    bg-white hover:bg-white cursor-pointer
    ${stage === "success"
                    ? "border-green-500"
                    : stage === "in-progress"
                        ? "border-yellow-500"
                        : "border-zinc-500"}
  `}
        >
            <div
                className={`
      w-2.5 h-2.5 rounded-full
      ${stage === "success"
                        ? "bg-green-500"
                        : stage === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-zinc-500"}
    `}
            ></div>
        </button>

    )
}
