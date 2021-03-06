import React from 'react'

export const Loading = () => (
    <div style={{width: '100%', height: '100%', backgroundColor: '#424242', backgroundRepeat: 'no-repeat', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <svg width={100} height={100} version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
            viewBox="0 0 100 100" enableBackground="new 0 0 100 100">
            <circle fill="none" stroke="#fff" strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="48"/>
            <line fill="none" strokeLinecap="round" stroke="#fff" strokeWidth="4" strokeMiterlimit="10" x1="50" y1="50" x2="85" y2="50.5">
            <animateTransform 
                attributeName="transform" 
                dur="2s"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite" />
            </line>
            <line fill="none" strokeLinecap="round" stroke="#fff" strokeWidth="4" strokeMiterlimit="10" x1="50" y1="50" x2="49.5" y2="74">
            <animateTransform 
                attributeName="transform" 
                dur="15s"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                repeatCount="indefinite" />
            </line>
        </svg>
    </div>
)


