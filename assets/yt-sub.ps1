$apiKey = "API-KEY"
$channelId = "CHANNEL-ID"

function Get-SubscriberCount {
    $url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=$channelId&key=$apiKey"
    $response = Invoke-RestMethod -Uri $url -Method Get
    
    if ($response -and $response.items.Count -gt 0) {
        $subscriberCount = $response.items[0].statistics.subscriberCount
        return $subscriberCount
    } else {
        return "Error fetching data"
    }
}

function Create-GUI {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing

    $form = New-Object System.Windows.Forms.Form
    $form.Text = "YouTube Sub Counter by TomMustBe12"
    $form.Size = New-Object System.Drawing.Size(600, 200)
    $form.StartPosition = "CenterScreen"
    
    $label = New-Object System.Windows.Forms.Label
    $label.Size = New-Object System.Drawing.Size(360, 60)
    $label.Location = New-Object System.Drawing.Point(20, 20)
    $label.Font = New-Object System.Drawing.Font("Mojangles", 36, [System.Drawing.FontStyle]::Bold)
    $label.ForeColor = [System.Drawing.Color]::Green
    $label.AutoSize = $true
    
    $form.Controls.Add($label)

    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 60000
    $timer.Add_Tick({
        $subCount = Get-SubscriberCount
        $label.Text = "Subscribers: " + $subCount
        Write-Host "Updated sub count: $subCount"
    })
    $timer.Start()

    $subCount = Get-SubscriberCount
    $label.Text = "Subscribers: " + $subCount

    $form.Add_Shown({$form.Activate()})
    [System.Windows.Forms.Application]::Run($form)
}

Create-GUI