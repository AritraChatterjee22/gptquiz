'use client'
import React from 'react'
import { User } from "next-auth"
import {signOut} from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import Link from 'next/link'
import { Button } from './ui/button'
import {LogOut} from "lucide-react"

type Props = {
    user: Pick<User, "name" | "image" | "email">
  }

const UserAccountNav = ({user}: Props) => {
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/*User Avatar*/}
        <Button>Hi</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-1 leading-none'>
            {user.name && <p className='font-medium'>{user.name}</p>}
            {
                user.email && (
                  <p className='w-[200px] truncate text-sm text-zinc-700'>
                    {user.email}
                  </p>
                )
              }
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/'>Anything</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e)=>{
            e.preventDefault()
            signOut().catch(console.error)
          }}
           className='text-red-600 cursor-pointer'
          >
          Sign Out
          <LogOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
