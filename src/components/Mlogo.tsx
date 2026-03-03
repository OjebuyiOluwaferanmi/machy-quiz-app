import * as motion from "motion/react-client"

export default function Mlogo() {
    return (
        <motion.div
            animate={{
                rotate: 360,
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
            }}
            style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                padding: "3px",
                background: "linear-gradient(#3b82f6, #1d4ed8, #93c5fd)",
                boxShadow: "0 4px 10px rgba(59, 130, 246, 0.4)",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#1d4ed8",
                }}
            >
                <motion.span
                    animate={{ rotate: -360 }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    M
                </motion.span>
            </div>
        </motion.div>
    )
}