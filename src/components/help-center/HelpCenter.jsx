import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';
import Dashboard from '../../sections/dashboard';
import Navbar from '../navbar';

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-purple-500/20 py-4">
      <button
        className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 dark:text-white focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {isOpen && <div className="mt-4 text-gray-600 dark:text-gray-400">{answer}</div>}
    </div>
  );
};

const HelpCenter = () => {
  const [showBanner, setShowBanner] = useState(true);
  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: (
        <div>
          <p>To reset your password, follow these steps:</p>
          <ol className="list-decimal list-inside mt-2">
            <li>Go to the login page and click on the "Forgot Password?" link.</li>
            <li>Enter the email address associated with your account.</li>
            <li>You will receive an email with a link to reset your password.</li>
            <li>Click the link and follow the instructions to create a new password.</li>
          </ol>
        </div>
      ),
    },
    {
      question: 'How do I join a class?',
      answer: 'To join a class, go to your dashboard and click on the "Join Class" button for the upcoming session. You will be redirected to the virtual classroom.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact our support team by emailing us at support@lingolandias.com or by using the contact form on our website. We are available 24/7 to assist you.',
    },
  ];

  return (
    <div className="flex w-full min-h-screen bg-gray-100 dark:bg-brand-dark">
      <Dashboard />
      <div className="w-full">
        <section className="w-full bg-brand-navbar-light dark:bg-brand-dark-secondary shadow-md border-b border-transparent dark:border-purple-500/20">
          <div className="container">
            <Navbar header="Help Center" />
          </div>
        </section>
        <div className="p-8">
          {showBanner && (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg mb-8 flex justify-between items-center shadow-md">
              <div className="flex items-center">
                <FiInfo className="text-2xl mr-3" />
                <p className="font-semibold">This page is for demonstration purposes only. Links and some content are placeholders.</p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-xl font-bold">&times;</button>
            </div>
          )}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white">Lingolandias Help Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
              Your success is our priority. Find the help you need below.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-brand-dark-secondary p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-purple-500/20">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Still need help?</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Our support team is always here to help. Reach out to us anytime.
              </p>
              <a
                href="mailto:support@lingolandias.com"
                className="inline-block bg-blue-600 dark:bg-brand-purple text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 dark:hover:bg-brand-orange transition-transform transform hover:scale-105 duration-300"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;