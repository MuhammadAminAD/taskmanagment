import ImgEmpty from "../../../assets/images/empty-box.webp"

export default function Empty() {
    return (
        <div className="text-center text-gray-400 py-8 flex items-center justify-center flex-col bg-zinc-50 rounded-2xl">
            <img src={ImgEmpty} alt="empty" width={100} height={100} />
            <h4>Empty</h4>
        </div>
    )
}
