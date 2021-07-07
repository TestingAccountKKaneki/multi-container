import React, { useState, useEffect } from 'react'
import axios from 'axios';

function Fib() {
    const [seenIndex, setSeenIndex] = useState([]);
    const [values, setValues] = useState({});
    const [index, setIndex] = useState('');

    const fetchValues = async () => {
        const val = await axios.get('/api/values/current')
        setValues(val.data);
        console.log(val);
    }

    const fetchIndex = async () => {
        const seenIdx = await axios.get('/api/values/all');
        setSeenIndex(seenIdx.data);
        console.log(seenIdx);
    }


    useEffect(() => {
        fetchValues();
        fetchIndex();
    }, [])

    const renderSeenIndex = seenIndex.map( x => x.number).join(', ');


    const renderValues = () => {
        const entries = [];
    
        for(let key in values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated { values[key] }
                </div>
            )
        }
        return entries;
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();

        await axios.post('/api/values', { 
            index: index
        });
        setIndex('');
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={(ev) => setIndex(ev.target.value)} type="number" placeholder="Enter Index" />
                <button>Submit</button>
            </form>
            <h3>
                Index I have seen: 
                { renderSeenIndex }
            </h3>
            <h3>
                { renderValues() }
            </h3>
        </div>
    )
}

export default Fib;
