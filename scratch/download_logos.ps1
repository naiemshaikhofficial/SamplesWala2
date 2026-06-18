$gpay_url = "https://cdn.jsdelivr.net/gh/datatrans/payment-logos@master/assets/wallets/google-pay.svg"
$out_gpay = "d:\Website\SamplesWala2\public\payment-logos\gpay.svg"
Write-Host "Downloading GPay from $gpay_url to $out_gpay"
Invoke-WebRequest -Uri $gpay_url -OutFile $out_gpay -UserAgent "Mozilla/5.0"

$rupay_urls = @(
    "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/rupay-logo.svg",
    "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/rupay-logo-icon.svg",
    "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/rupay.svg",
    "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/rupay-card-icon.svg"
)

$downloaded = $false
foreach ($url in $rupay_urls) {
    $out_rupay = "d:\Website\SamplesWala2\public\payment-logos\rupay.svg"
    try {
        Write-Host "Trying RuPay URL: $url"
        Invoke-WebRequest -Uri $url -OutFile $out_rupay -UserAgent "Mozilla/5.0"
        $downloaded = $true
        Write-Host "Successfully downloaded RuPay from $url!"
        break
    } catch {
        Write-Host "Failed to download from $url..."
    }
}

if (-not $downloaded) {
    Write-Host "All RuPay URLs failed."
}
