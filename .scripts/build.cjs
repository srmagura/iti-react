const child_process = require('child_process')

function exec(cmd) {
    console.log(`> ${cmd}`)

    return new Promise((resolve, reject) => {
        child_process.exec(cmd, (error, stdout, stderr) => {
            if (error) return reject(error)

            if (stdout.trim()) console.log(stdout)

            if (stderr.trim()) console.log(stderr)
            resolve()
        })
    })
}

async function main() {
    await exec('yarn workspace @interface-technologies/webpack-config build')
    await exec('yarn workspace @interface-technologies/iti-react-core build')
    await exec('yarn workspace @interface-technologies/iti-react build')
    await exec(
        'yarn workspace @interface-technologies/check-for-js-bundle-update-saga build'
    )
    await exec('yarn workspace @interface-technologies/permissions build')
    console.log('SUCCESS')
}

main().catch((e) => {
    console.error(e)
    process.exitCode = 1
})
