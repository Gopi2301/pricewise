"use client"
import { Description, Dialog, DialogPanel, DialogTitle, Transition,TransitionChild } from '@headlessui/react'
import Image from 'next/image'
import { FormEvent, Fragment, useState } from 'react'
const Modal = () => {
    let [isOpen, setIsOpen] = useState(false)
    const [isSubmitting,setIsSubmitting] = useState(false)
    const [email, setEmail] = useState("")
    const handleSubmit = async (e:FormEvent<HTMLFormElement>)=>{
         e.preventDefault();
         setIsSubmitting(true);
        //  await addUserEmailToProduct(productId, email);
        setIsSubmitting(false);
        setEmail("")

    }
    const openModal =()=> setIsOpen(true)
    const closeModal =()=> setIsOpen(false)
  return (
    <>
      <button type='button' className='btn' onClick={openModal}>Track</button>
      <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={closeModal} className="dialog-container">
       <div className="min-h-screen px-4 text-center">
        <span className='inline-block h-screen align-middle' aria-hidden="true" />
        <TransitionChild as={Fragment} enter="ease-out duration-300" enterFrom='opacity-0' enterTo='opacity-100' leave='ease-in duration-200' leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className='dialog-content'>
                <div className="flex flex-col">
                    <div className='flex justify-between'>
                        <div className='p-3 border border-gray-200 rounded-10'>
                            <Image src="/assets/icons/logo.svg" alt="logo" width="28" height="28"/>
                        </div>
                        <Image src="/assets/icons/x-close.svg" alt="close" width="24" height="24" className="cursor-pointer" onClick={closeModal}/>
                    </div>
                    <h4 className='dialog-head'>Stay Updated with product pricing alerts right in yout inbox!</h4>
                    <p className='text-sm text-gray-600 mt-2'>Never miss the Bargain again with our timely alerts!</p>
                    <form action="" className='flex flex-col mt-5' onSubmit={handleSubmit}>
                        <label htmlFor="email" className='test-sm font-medium text-gray-700'>Email Address</label>
                        <div className="dialog-input_container">
                            <Image src="/assets/icons/mail.svg" alt="mail" width={18} height={18}/>
                            <input type="email"  value={email} onChange={(e)=>setEmail(e.target.value)} required placeholder='Enter your Email Address' className='dialog-input' />
                        </div>
                        <button type='submit' className='dialog-btn'>{isSubmitting ? "Submitting..." :"Track" }</button>
                    </form>
                </div>
            </div>
        </TransitionChild>
       </div>
      </Dialog>
      </Transition>
      
    </>
  )
}

export default Modal
