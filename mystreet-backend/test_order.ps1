# Test script to debug the order API

# Step 1: Register user
$registerUrl = "http://localhost:8080/api/auth/register"
$registerBody = @{
    email = "debug@test.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Step 1: Registering user..."
$registerResponse = Invoke-RestMethod -Uri $registerUrl -Method POST -Body $registerBody -ContentType "application/json"
$token = $registerResponse.token
$email = $registerResponse.email
Write-Host "Registered: $email"
Write-Host "Token: $token"

# Step 2: Get products
$productsUrl = "http://localhost:8080/api/products"
Write-Host "`nStep 2: Getting products..."
$productsResponse = Invoke-RestMethod -Uri $productsUrl -Method GET -ContentType "application/json"
$productId = $productsResponse[0].id
Write-Host "First Product ID: $productId"
Write-Host "Product: $($productsResponse[0] | ConvertTo-Json)"

# Step 3: Place order
$ordersUrl = "http://localhost:8080/api/orders"
$orderBody = @{
    items = @(
        @{
            productId = $productId
            size = "8"
            quantity = 1
            price = 119.99
        }
    )
    shippingAddress = "madhur, 29 dlkjasd, lksajd, Ajsd, 1jakdha - 132019, Phone: 3884939403"
    paymentMode = "CASH_ON_DELIVERY"
} | ConvertTo-Json -Depth 10

Write-Host "`nStep 3: Placing order..."
Write-Host "Request Body: $orderBody"

try {
    $orderResponse = Invoke-RestMethod -Uri $ordersUrl -Method POST -Body $orderBody -ContentType "application/json" -Headers @{
        "Authorization" = "Bearer $token"
    }
    Write-Host "Order Response: $($orderResponse | ConvertTo-Json)"
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    Write-Host "Response: $($_.Exception.Response | ConvertTo-Json)"
}

