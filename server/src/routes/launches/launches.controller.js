const { 
    existsWithId, 
    getAllLaunches, 
    scheduleNewLaunch, 
    abortLaunchById } = require('../../models/launches.model');

async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target) {
            return res.status(400).json({
                error: 'Missing required launch information',
            });
        }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    
    const launchExistsWithId = await existsWithId(launchId);
    if (!launchExistsWithId) {
        return res.status(404).json({
            error: 'No launch found with id',
        });
    }
    
    const aborted = await abortLaunchById(launchId);

    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.status(200).json({
        ok: true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};