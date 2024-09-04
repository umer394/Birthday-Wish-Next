"use client";
import { useState,useEffect } from "react"
import { Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import dynamic from "next/dynamic"
import {motion,AnimatePresence} from "framer-motion"
import { FaBirthdayCake,FaGift } from "react-icons/fa"
import { GiBalloons } from "react-icons/gi"

type confettiProps= {
    width:number
    height:number
}

const DynamicConfetti = dynamic(() => import('react-confetti'),{ssr:false})

const candleColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
const confettiColors =  ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']

export default function BirthdayWish(){
    const [candlesLit ,setCandlesLit] = useState<number>(0)
    const [balloonsPoppedCount ,setBalloonsPoppedCount] = useState<number>(0)
    const [showConfetti,setShowConfetti] = useState<boolean>(false)
    const [windowSize,setWindowSize] = useState<confettiProps>({width:0,height:0})
    const [celeberating,setCeleberating] = useState<boolean>(false)

    const totalCandles:number = 5 
    const totalBalloons:number = 5
    
    useEffect(()=>{
        const handleResize = () => {
            setWindowSize({width:window.innerWidth,height:window.innerHeight})
        }
        handleResize()
        window.addEventListener('resize',handleResize)
        return ()=> window.removeEventListener('resize',handleResize)
    },[])

    useEffect(()=>{
        if(candlesLit === totalCandles && balloonsPoppedCount === totalBalloons){
            setShowConfetti(true)
        }
    },[candlesLit,balloonsPoppedCount])

    const lightCandle = (index:number)=>{
        if(index===candlesLit){
            setCandlesLit(prev=>prev+1)
        }
    }

    const popBalloon = (index:number)=>{
        if(index===balloonsPoppedCount){
            setBalloonsPoppedCount(prev=>prev+1)
        }
    }

    const celeberate = ( ) => {
        setCeleberating(true)
        setShowConfetti(true)
        const interval = setInterval(()=>{
            setCandlesLit(prev =>{
                if(prev<totalCandles) return prev + 1
                clearInterval(interval)
                return prev
            })
        },500)
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-white p-4">
            <motion.div 
                initial={{scale:0.9,opacity:0}}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="mx-auto overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl border-2 border-black">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold text-black">Happy 20th Birthday</CardTitle>
                        <CardDescription className="text-2xl font-semibold text-gray-600">Asharib Ali</CardDescription>
                        <p className="text-lg text-gray-500">September 4th</p>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div>
                            <h3 className="mb-2 text-black font-semibold text-lg">Light the Candles:</h3>
                            <div className="flex justify-center space-x-2">
                                {[...Array(totalCandles)].map((_,index)=>(
                                    <AnimatePresence key={index}>
                                        {(celeberating && index <= candlesLit) || (!celeberating && index<candlesLit) ?(
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{ duration: 0.5, delay: celeberating ? index * 0.5 : 0 }}
                                            >
                                                <FaBirthdayCake
                                                className="w-8 h-8 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110"
                                                style={{color: candleColors[index % candleColors.length] }}
                                                onClick={()=>lightCandle(index)}/>
                                            </motion.div>
                                        ):(<FaBirthdayCake
                                            className="w-8 h-8 text-gray-300 transition-colors duration-300 ease-in-out cursor-pointer hover:scale-110"
                                            onClick={()=>lightCandle(index)}
                                        />) }
                                    </AnimatePresence>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-black mb-2">Pop the balloons:</h3>
                            <div className="flex justify-center space-x-2">
                                {[...Array(totalBalloons)].map((_,index)=> (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 1 }}
                                        animate={{ scale: index < balloonsPoppedCount ? 0 : 1 }}
                                        transition={{ duration: 0.3 }}
                                        >
                                        <GiBalloons 
                                        className={"w-8 h-8 cursor-pointer hover:scale-110"}
                                        style={{color : index< balloonsPoppedCount ? '#D1D5DB' : balloonColors[index % balloonColors.length] }}
                                        onClick={()=>popBalloon(index)}/>
                                    </motion.div>
                                )  )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                       <Button
                       className="bg-black text-white hover:bg-gray-800 transition-all duration-300"
                       onClick={celeberate}
                       disabled={celeberating}>
                        Celeberate! <FaGift className="ml-2 h-4 w-4"/>
                       </Button>
                    </CardFooter>
                 </Card>
            </motion.div>
            {showConfetti && (
                <DynamicConfetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={500}
                colors={confettiColors}/>
            )}
        </div>
    )
}