import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

/**
 * Componente Calendar.
 * 
 * @param {Array} events - Lista de eventos a mostrar en el calendario.
 * @param {function} onSelectSlot - Función para manejar la selección de una ranura en el calendario.
 * @returns {JSX.Element} Componente del calendario.
 */
function MyCalendar({ events, onSelectSlot }) {
    return (
        <div className="calendar-container">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectSlot={onSelectSlot}
            />
        </div>
    );
}

export default MyCalendar;
