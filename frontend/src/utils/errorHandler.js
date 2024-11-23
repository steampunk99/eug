import { toast } from "../components/ui/use-toast"

export const handleApiError = (error) => {
    if (error.response) {
        // Rate limit error
        if (error.response.status === 429) {
            const retryAfter = error.response.data.details?.minutesUntilReset || 15;
            const remainingRequests = error.response.data.details?.remainingRequests || 0;
            
            toast({
                variant: "destructive",
                title: "Rate Limit Exceeded",
                description: `Please wait ${retryAfter} minutes before trying again. You have ${remainingRequests} requests remaining.`,
                duration: 5000,
            });
        }
        // Authentication error
        else if (error.response.status === 401) {
            toast({
                variant: "destructive",
                title: "Session Expired",
                description: "Your session has expired. Please log in again.",
                duration: 5000,
            });

            // Clear any stored auth state
            localStorage.removeItem('user');
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        // Other API errors
        else {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response.data.message || "An unexpected error occurred",
                duration: 5000,
            });
        }
    }
    // Network errors
    else if (error.request) {
        toast({
            variant: "destructive",
            title: "Network Error",
            description: "Unable to connect to the server. Please check your internet connection.",
            duration: 5000,
        });
    }
    // Other errors
    else {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "An unexpected error occurred",
            duration: 5000,
        });
    }
};
