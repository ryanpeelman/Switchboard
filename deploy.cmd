    @echo off
    IF "%SITE_FLAVOR%" == "switchboard" (
      echo Deploying switchboard
      deploy.switchboard.cmd
    ) ELSE (
      IF "%SITE_FLAVOR%" == "tokbox" (
	echo Deploying tokbox
        deploy.tokbox.cmd
      ) ELSE (
        echo You have to set SITE_FLAVOR setting to either "switchboard" or "tokbox"
        exit /b 1
      )
    )