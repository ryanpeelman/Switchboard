
class EventValidator {
    isEventValid(event) {
        if (!event.hasOwnProperty("heartrate")) {
            return true;
        }

        if (!event.heartrate) {
            return true;
        }

        const heartrateLowerThreshold = 50;
        const heartrateUpperThreshold = 85;
        const heartrate = parseInt(event.heartrate, 10);
        return heartrateLowerThreshold < heartrate && heartrate < heartrateUpperThreshold;
    }
}

module.exports = new EventValidator();