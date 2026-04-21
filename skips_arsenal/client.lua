----------------------------------------------------------------
---------------------EDIT BY: SkipS#1234
----------------------------------------------------------------
local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
client = {}
Tunnel.bindInterface("skips_arsenal",client)

inMenu = false

local arsenal = {
	{ 1323.3, -777.25, 65.67 },
	{ 2610.345703125,5346.46875,47.563369750977 },
	{ 279.13, -346.96, 49.59 }, 
	{ 58.1, 6540.21, 32.5 }, -- Baep
	{ -2007.32, -475.51, 12.23 },
	{ -2358.31640625,3255.03125,32.810718536377 },
}

Citizen.CreateThread(function()
	SetNuiFocus(false,false)
	while true do
		local sleep = 1000
		local playerPed = PlayerPedId()
		local coords = GetEntityCoords(playerPed)
		
		for _,lugares in pairs(arsenal) do
			local x,y,z = table.unpack(lugares)
			local distance = #(coords - vector3(x,y,z))

			if distance <= 3 then
				sleep = 5
				DrawMarker(41, x,y,z-0.6,0,0,0,0.0,0,0,0.5,0.5,0.4,88,179,252,50,0,0,0,1)
				if distance <= 1.2 then
					if IsControlJustPressed(0,38) then
						TriggerServerEvent('ndk:permissao')
					end
				end
			end
		end

		Wait(sleep)
	end
end)

RegisterNetEvent('ndk:permissao')
AddEventHandler('ndk:permissao',function()
	inMenu = true
	SetNuiFocus(true, true)
	SendNUIMessage({showMenu = true})
end)

-- Fecha o menu e remove o foco da NUI
RegisterNUICallback('NUIFocusOff', function(data, cb)
	inMenu = false
	SetNuiFocus(false,false)
	TransitionFromBlurred(1000)
	-- SetCursorPosition removido pois não existe no FiveM
	cb({})
end)

-- Callback genérico para pegar ARMA (item)
RegisterNUICallback('giveWeapon', function(data, cb)
    if data and data.id then
	    TriggerServerEvent('skips_arsenal:giveWeapon', data.id)
    end
	cb({})
end)

-- Callback genérico para pegar MUNIÇÃO (item)
RegisterNUICallback('giveAmmo', function(data, cb)
    if data and data.id then
	    TriggerServerEvent('skips_arsenal:giveAmmo', data.id)
    end
	cb({})
end)

-- Outros callbacks
RegisterNUICallback('colete', function(data, cb)
	TriggerServerEvent('skips_arsenal:colete')
	cb({})
end)

RegisterNUICallback('Limpar', function(data, cb)
	local ped = PlayerPedId()
	RemoveAllPedWeapons(ped, true)
	cb({})
end)

-- Callback para o Kit Básico (entrega múltiplos itens no servidor se preferir, 
-- mas aqui mantemos simples chamando o evento de colete + armas básicas)
RegisterNUICallback('KITBASICO', function(data, cb)
    TriggerServerEvent('skips_arsenal:giveWeapon', 'm1911')
    TriggerServerEvent('skips_arsenal:giveWeapon', 'stungun')
    TriggerServerEvent('skips_arsenal:colete')
	cb({})
end)
