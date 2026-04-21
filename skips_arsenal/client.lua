----------------------------------------------------------------
---------------------EDIT BY: SkipS#1234
----------------------------------------------------------------
local Tunnel = module("vrp","lib/Tunnel")
local Proxy = module("vrp","lib/Proxy")
vRP = Proxy.getInterface("vRP")
client = {}
Tunnel.bindInterface("skips_arsenal",client)

inMenu = false
local Menu = true

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
		sleep = 1000
		
		for _,lugares in pairs(arsenal) do
			local x,y,z = table.unpack(lugares)
			local distance = GetDistanceBetweenCoords(GetEntityCoords(GetPlayerPed(-1)),x,y,z,true)

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


function client.PertoArsenal()
	local posPed = GetEntityCoords(PlayerPedId())
	for _, lugares in pairs(arsenal) do
		local x,y,z = table.unpack(lugares)
		if GetDistanceBetweenCoords(x,y,z, posPed) < 5 then
			return true 
		end
	end
end


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
	SetCursorPosition(0.0,false)
	cb({})
end)

----------------------
-- RIFLES
----------------------

RegisterNUICallback('m4a1', function(data, cb)
	local ped = PlayerPedId()
	-- Remove arma rival da mesma categoria antes de dar a nova
	SetPedAmmo(ped,GetHashKey("WEAPON_SPECIALCARBINE"),0)
	RemoveWeaponFromPed(ped,GetHashKey("WEAPON_SPECIALCARBINE"))
	-- Último parâmetro = false: adiciona ao inventário SEM equipar
	GiveWeaponToPed(ped,GetHashKey("WEAPON_CARBINERIFLE"),200,false,false)
	cb({})
end)

RegisterNUICallback('m4a4', function(data, cb)
	local ped = PlayerPedId()
	SetPedAmmo(ped,GetHashKey("WEAPON_CARBINERIFLE"),0)
	RemoveWeaponFromPed(ped,GetHashKey("WEAPON_CARBINERIFLE"))
	GiveWeaponToPed(ped,GetHashKey("WEAPON_SPECIALCARBINE"),200,false,false)
	cb({})
end)

----------------------
-- SMGs
----------------------

RegisterNUICallback('mp5', function(data, cb)
	local ped = PlayerPedId()
	SetPedAmmo(ped,GetHashKey("WEAPON_COMBATPDW"),0)
	RemoveWeaponFromPed(ped,GetHashKey("WEAPON_COMBATPDW"))
	GiveWeaponToPed(ped,GetHashKey("WEAPON_SMG"),200,false,false)
	cb({})
end)

RegisterNUICallback('mpx', function(data, cb)
	local ped = PlayerPedId()
	SetPedAmmo(ped,GetHashKey("WEAPON_SMG"),0)
	RemoveWeaponFromPed(ped,GetHashKey("WEAPON_SMG"))
	GiveWeaponToPed(ped,GetHashKey("WEAPON_COMBATPDW"),200,false,false)
	cb({})
end)

----------------------
-- ESCOPETA
----------------------

RegisterNUICallback('shot45', function(data, cb)
	local ped = PlayerPedId()
	SetPedAmmo(ped,GetHashKey("WEAPON_PUMPSHOTGUN_MK2"),0)
	GiveWeaponToPed(ped,GetHashKey("WEAPON_PUMPSHOTGUN_MK2"),100,false,false)
	cb({})
end)

----------------------
-- PISTOLAS
----------------------

RegisterNUICallback('fiveseven', function(data, cb)
	local ped = PlayerPedId()
	SetPedAmmo(ped,GetHashKey("WEAPON_PISTOL_MK2"),0)
	RemoveWeaponFromPed(ped,GetHashKey("WEAPON_COMBATPISTOL"))
	GiveWeaponToPed(ped,GetHashKey("WEAPON_PISTOL_MK2"),250,false,false)
	cb({})
end)

RegisterNUICallback('glock18', function(data, cb)
	local ped = PlayerPedId()
	SetPedAmmo(ped,GetHashKey("WEAPON_COMBATPISTOL"),0)
	RemoveWeaponFromPed(ped,GetHashKey("WEAPON_PISTOL_MK2"))
	GiveWeaponToPed(ped,GetHashKey("WEAPON_COMBATPISTOL"),250,false,false)
	cb({})
end)

----------------------
-- KIT BÁSICO
----------------------

RegisterNUICallback('KITBASICO', function(data, cb)
	local ped = PlayerPedId()
	GiveWeaponToPed(ped,GetHashKey("WEAPON_NIGHTSTICK"),0,false,false)
	GiveWeaponToPed(ped,GetHashKey("WEAPON_KNIFE"),0,false,false)
	GiveWeaponToPed(ped,GetHashKey("WEAPON_STUNGUN"),0,false,false)
	GiveWeaponToPed(ped,GetHashKey("WEAPON_FLASHLIGHT"),0,false,false)
	TriggerServerEvent('skips_arsenal:colete')
	cb({})
end)

----------------------
-- UTILITÁRIOS
----------------------

RegisterNUICallback('Taser', function(data, cb)
	local ped = PlayerPedId()
	GiveWeaponToPed(ped,GetHashKey("WEAPON_STUNGUN"),0,false,false)
	cb({})
end)

RegisterNUICallback('Lanterna', function(data, cb)
	local ped = PlayerPedId()
	GiveWeaponToPed(ped,GetHashKey("WEAPON_FLASHLIGHT"),0,false,false)
	cb({})
end)

RegisterNUICallback('KCT', function(data, cb)
	local ped = PlayerPedId()
	GiveWeaponToPed(ped,GetHashKey("WEAPON_NIGHTSTICK"),0,false,false)
	cb({})
end)

RegisterNUICallback('Faca', function(data, cb)
	local ped = PlayerPedId()
	GiveWeaponToPed(ped,GetHashKey("WEAPON_KNIFE"),0,false,false)
	cb({})
end)

RegisterNUICallback('colete', function(data, cb)
	TriggerServerEvent('skips_arsenal:colete')
	cb({})
end)

RegisterNUICallback('Limpar', function(data, cb)
	local ped = PlayerPedId()
	RemoveAllPedWeapons(ped,true)
	cb({})
end)
