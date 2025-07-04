import { Icon, Link } from "@chakra-ui/react";
import { FaDiscord, FaFacebook, FaInstagram, FaLink, FaLinkedin, FaPinterest, FaReddit, FaSnapchat, FaTiktok, FaTumblr, FaTwitch, FaTwitter, FaYoutube } from "react-icons/fa";
import { Tooltip } from "@/components/ui/tooltip"
import { useColorMode } from "@/components/ui/color-mode";

interface UserSocialNetworkProps {
    socialNetwork: string;
    link: string;
    size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const IconsSocialMedia = ({socialNetwork, link, size}: UserSocialNetworkProps) => {
    const { colorMode } = useColorMode()

    const getSocialNetworkIcon = (socialNetwork: string) => {
        switch (socialNetwork.toLowerCase()) {
            case 'facebook':
                return <FaFacebook/>
            case 'instagram':
                return <FaInstagram/>
            case 'x':
                return <FaTwitter/>
            case 'snapchat':
                return <FaSnapchat/>
            case 'tiktok':
                return <FaTiktok/>
            case 'youtube':
                return <FaYoutube/>
            case 'linkedin':
                return <FaLinkedin/>
            case 'pinterest':
                return <FaPinterest/>
            case 'reddit':
                return <FaReddit/>
            case 'tumblr':
                return <FaTumblr/>
            case 'twitch':
                return <FaTwitch/>
            case 'discord':
                return <FaDiscord/>
            default:
                return <FaLink/>
        }
    }

    const icono = getSocialNetworkIcon(socialNetwork)

    return icono ? (
        <Tooltip
            content={socialNetwork}
            openDelay={500}
            closeDelay={100}
            unmountOnExit={true}    
            lazyMount={true}
            positioning={{ placement: "top" }}
            showArrow
            contentProps={{ 
                css: { 
                    "--tooltip-bg": colorMode === "light" ? "colors.cyan.500":"colors.pink.500",
                }
            }}
        >    
            <Link href={link} target="_blank" rel="noopener noreferrer">
                <Icon size={size} color={colorMode === "light" ? "cyan.500":"pink.500"}>
                    {icono}
                </Icon>
            </Link>
        </Tooltip>
    ) : socialNetwork;
}

export default IconsSocialMedia;