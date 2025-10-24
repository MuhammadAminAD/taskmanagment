import { useNavigate } from "react-router-dom";

export default function NoteCard({ title, logo, id }: { title: string, logo: string, id: string }) {
    const navigate = useNavigate()
    return (
        <div
            onClick={() => navigate(`${id}`)}
            className="py-3 border-b border-neutral-300 px-4 flex items-center justify-between hover:bg-zinc-50">
            <h4 className="font-medium text-neutral-700 flex items-center gap-3">
                <img src={`https://tmanagment.up.railway.app/public${logo}`} width={"24"} height={"24"} />
                {title}
            </h4>

            <div>
                <p className="text-sm text-zinc-600">last update: 15min ago</p>
            </div>
        </div >
    )
}
