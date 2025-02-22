"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { User, ChevronDown, LogOut, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

type UserType = {
  name: string
  type: "student" | "merchant"
} | null


const menuItems = [
    { name: "Home", path: "/Dashboard/UserDashboard" },
    { name: "Convert", path: "/ConversionPage" },
    { name: "Stats", path: "/StatsPage" },
    { name: "Wallet", path: "/WalletPage" },
    { name: "Transfer", path: "/TransferPage" }
  ]

interface NavbarProps {
  selectedMenuItem: string
}

export default function Navbar({ selectedMenuItem }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginOptions, setShowLoginOptions] = useState(false)
  const [user, setUser] = useState<UserType>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter();


  // const handleLogin = (type: "student" | "merchant") => {
  //   // setIsLoggedIn(true)
  //   // setUser({ name: `Test ${type}`, type })
  //   // setShowLoginOptions(false)
  //   if(type=="student"){
  //     router.push("/auth/UserSignin");
  //   }
  //   else{
  //     router.push("/auth/BusinessSignin");
  //   }
  // }

  const handleLogin = (type: "student" | "merchant") => {
    // If you want to redirect to a login page, clear any current login state (if applicable)
    setIsLoggedIn(false)
    setUser(null)
    
    if(type === "student"){
      router.push("/auth/UserSignin")
    } else {
      router.push("/auth/BusinessSignin")
    }
  }
  

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image
              className="rounded"
              src="https://unipay7781.s3.us-east-1.amazonaws.com/logo.png"
              alt="Logo"
              width={40}
              height={40}
            />
          </div>

          {/* Desktop Menu Items */}
          <div className="hidden md:flex items-center justify-center flex-1">
            {menuItems.map(({name, path}) => (
              <Link
                key={name}
                href={path}

                className={`text-gray-700 hover:bg-black hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 mx-1 ${
                  selectedMenuItem === name ? "bg-black text-white" : ""
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-700" />
          <span className="text-gray-700 font-medium">{localStorage.getItem("username") || "Guest"}</span>
        </div>


          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-md"
          >
            {menuItems.map(({name, path}) => (
              <Link
                key={name}
                href={path}
                className={`block px-4 py-2 text-gray-700 hover:bg-black hover:text-white ${
                  selectedMenuItem === name ? "bg-black text-white" : ""
                }`}
              >
                {name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
