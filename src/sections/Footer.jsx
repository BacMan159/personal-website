import React from 'react'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container flex items-center justify-center">
                <p className="text-center">
                    © {new Date().getFullYear()} Bhasanth | All rights reserved
                </p>
            </div>
        </footer>
    )
}
export default Footer
