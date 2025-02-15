import Image from 'next/image';
import Link from 'next/link';
import { RoomCard } from 'components/Rooms/room-card'
export default function RelatedRooms({ rooms }) {
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Related Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {rooms.map((room) => (
                    <Link key={room.id} href={`/room/${room.id}`} className="block">
                        <RoomCard key={room.id} room={room} />
                    </Link>
                ))}
            </div>
        </div>
    );
}