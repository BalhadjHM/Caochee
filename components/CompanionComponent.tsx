"use client";
import { cn, configureAssistant, getSubjectColor } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import sowndwaves from "@/constants/soundwaves.json";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
}

const CompanionComponent = ({
	name,
	subject,
	topic,
	style,
	voice,
	companionId,
	userName,
	userImage,
}: CompanionComponentProps) => {
	const [callStatus, setCallStatus] = React.useState<CallStatus>(
		CallStatus.INACTIVE,
	);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const lottieRef = React.useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (isSpeaking) {
			lottieRef.current?.play();
		} else {
			lottieRef.current?.stop();
		}
	}, [isSpeaking, lottieRef]);

	useEffect(() => {
		const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
		const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
		const onMessage = (message: string) =>
			console.log("Received message:", message);
		const onError = (error: Error) =>
			console.error("Companion error:", error);
		const onSpeechStart = () => setIsSpeaking(true);
		const onSpeechEnd = () => setIsSpeaking(false);

		vapi.on("call-start", onCallStart);
		vapi.on("call-end", onCallEnd);
		vapi.on("message", onMessage);
		vapi.on("error", onError);
		vapi.on("speech-start", onSpeechStart);
		vapi.on("speech-end", onSpeechEnd);

		return () => {
			vapi.off("call-start", onCallStart);
			vapi.off("call-end", onCallEnd);
			vapi.off("message", onMessage);
			vapi.off("error", onError);
			vapi.off("speech-start", onSpeechStart);
			vapi.off("speech-end", onSpeechEnd);
		};
	}, []);

	const toggleMicrophone = () => {
		const isMuted = vapi.isMuted;
		vapi.setMuted(!isMuted);
		setIsMuted(!isMuted);
	};

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        const assistantOverrides = {
            variableValues: {subject, topic, style},
            clientMessages: ['transcript'],
            serverMessages: [],
        }

        vapi.start(configureAssistant(voice, style), assistantOverrides);
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED);
        vapi.stop();
    }

	return (
		<section className="flex flex-col h-[70vh]">
			<section className="flex gap-8 max-sm:flex-col">
				<div className="companion-section">
					<div
						className="companion-avatar"
						style={{ backgroundColor: getSubjectColor(subject) }}
					>
						<div
							className={cn(
								"absolute transition-opacity duration-1000",
								callStatus === CallStatus.FINISHED ||
									callStatus === CallStatus.INACTIVE
									? "opacity-100"
									: "opacity-0",
								callStatus === CallStatus.CONNECTING
									? "animate-pulse opacity-100"
									: "",
							)}
						>
							<Image
								src={`/icons/${subject}.svg`}
								alt={`${subject} icon`}
								width={150}
								height={150}
								className="max-sm:w-fit"
							/>
						</div>
						<div
							className={cn(
								"absolute transition-opacity duration-1000",
								callStatus === CallStatus.ACTIVE
									? "opacity-100"
									: "opacity-0",
							)}
						>
							<Lottie
								className="companion-lottie"
								lottieRef={lottieRef}
								animationData={sowndwaves}
								loop={true}
								autoplay={false}
								style={{ width: 150, height: 150 }}
							/>
						</div>
					</div>
					<p className="font-bold text-2xl">{name}</p>
				</div>
				<div className="user-section">
					<div className="user-avatar">
						<Image
							src={userImage}
							alt={`${userName} avatar`}
							width={130}
							height={130}
							className="rounded-lg"
						/>
						<p className="font-bold text-2xl">{userName}</p>
					</div>
					<button className="btn-mic" onClick={toggleMicrophone}>
						<Image
							src={
								isMuted
									? `/icons/mic-off.svg`
									: `/icons/mic-on.svg`
							}
							alt="mic"
							width={36}
							height={36}
						/>
						<p className="max-sm:hidden">
							{isMuted
								? "Turn on microphone"
								: "Turn off microphone"}
						</p>
					</button>
					<button
						className={cn(
							"rounded-lg cursor-pointer py-2 transition-colors text-white", callStatus === CallStatus.ACTIVE
                                ? "bg-red-700"
                                : "bg-primary",
                                callStatus === CallStatus.CONNECTING ? "animate-pulse" : "",
						)}
                        onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
					>
						{callStatus === CallStatus.ACTIVE
							? "End Call"
							: callStatus === CallStatus.CONNECTING
								? "Connecting..."
								: "Start Call"}
					</button>
				</div>
			</section>

            <section className="transcript">
                <div className="transcript-message no-scrollbar">
                    MESSAFES
                </div>
                <div className="transcript-fade" />
            </section>
		</section>
	);
};

export default CompanionComponent;
