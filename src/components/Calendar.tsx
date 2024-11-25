import { FC, useEffect, useState } from "react";
import Dialog from 'rc-dialog';
import 'rc-dialog/assets/index.css';
import leftIcon from '../assets/leftIcon.svg';
import rightIcon from '../assets/rightIcon.svg';

const Calendar: FC = () => {
    const [weekDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [currentDate] = useState(new Date());
    const [dates, setDates] = useState<(null | number)[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [events, setEvents] = useState<{ [key: number]: { title: string, date: string }[] }>({});

    useEffect(() => {
        const dCount = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = (new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 6) % 7;
        const d = Array.from({ length: 42 }, (_, i) => {
            if (i < firstDayOfMonth || i >= dCount + firstDayOfMonth) return null;
            return i - firstDayOfMonth + 1;
        });
        setDates(d);
    }, [currentMonth]);

    const handlePrev = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNext = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const handleAddEvent = () => setIsModalOpen(true);
    const handleModalClose = () => setIsModalOpen(false);
    const handleEventSubmit = () => {
        const newEvent = { title: eventTitle, date: eventDate };
        const dateKey = new Date(eventDate).getDate();
        setEvents(prev => ({
            ...prev,
            [dateKey]: [...(prev[dateKey] || []), newEvent],
        }));
        setIsModalOpen(false);
        setEventTitle('');
        setEventDate('');
    };

    return (
        <div className="mt-20">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-2xl">{currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}</h3>
                <div className="flex gap-3">
                    <span onClick={handlePrev}><img className="w-10 h-10 border p-3 rounded flex items-center justify-center cursor-pointer" src={leftIcon} alt="" /></span>
                    <span onClick={handleNext}><img className="w-10 h-10 border p-3 rounded flex items-center justify-center cursor-pointer" src={rightIcon} alt="" /></span>
                </div>
            </div>
            <div>
                <div className="mt-5 flex justify-between flex-wrap">
                    {weekDays.map((weekDay, index) => (
                        <div className="font-bold text-2xl text-center w-1/7" key={index}>
                            <h3 className="text-center bg-blue-200">{weekDay}</h3>
                        </div>
                    ))}

                    {dates.map((date, index) => (
                        <div
                            className={`font-bold text-md text-center w-1/7 min-h-20 p-2 mt-2 
                                ${date ? 'border border-blue-600' : ''}
                                ${currentDate.getFullYear() === currentMonth.getFullYear() &&
                                currentDate.getMonth() === currentMonth.getMonth() &&
                                currentDate.getDate() === date
                                ? 'bg-blue-400'
                                : ''
                            }`}
                            key={index}
                        >
                            <p className="text-right">{date}</p>
                            {events[date]?.map((event, i) => (
                                <div key={i} className="bg-gray-100 p-1 mt-1 text-sm">
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <button onClick={handleAddEvent} className="bg-blue-600 text-white py-2 px-4 rounded mt-5">Add Event</button>
            </div>

            <Dialog
                visible={isModalOpen}
                onClose={handleModalClose}
                title="Add New Event"
                animation="zoom"
                maskAnimation="fade"
            >
                <div className="flex flex-col gap-4">
                    <label>
                        <input
                            type="text"
                            className="border p-2 w-full"
                            placeholder="Event Title"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                    </label>
                    <label>
                        <input
                            type="date"
                            className="border p-2 w-full"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                    </label>
                    <button
                        onClick={handleEventSubmit}
                        className="bg-black text-white py-2 px-4 mt-4 rounded"
                    >
                        Add Event
                    </button>
                </div>
            </Dialog>
        </div>
    );
};

export default Calendar;
