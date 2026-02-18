import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const CTA = () => {
  return (
    <section className='cta-section'>
        <div className="cta-badge">Start Learning Your Way.</div>
        <h2 className="text-3xl font-bold">Build and Personalize Learning Companion</h2>
        <p className=''>Transform your learning experience with AI-powered companions tailored to your needs.</p>
        <Image src="/images/cta.svg" alt="CTA Image" width={362} height={232} />
        <button className="btn-primary">
            <Image src="/icons/plus.svg" alt="Plus icon" width={12} height={12} />
            <Link href="/companions/new">
                <p>Build a New Companion</p>
            </Link>
        </button>
    </section>
  )
}

export default CTA