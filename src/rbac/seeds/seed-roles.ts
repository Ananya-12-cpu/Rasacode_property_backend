import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { Plan, PlanType } from '../../entities/plan.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const planRepository = dataSource.getRepository(Plan);

  console.log('🌱 Seeding roles and plans...');

  // Check if roles already exist
  const existingRoles = await roleRepository.find();
  if (existingRoles.length > 0) {
    console.log('⚠️  Roles already exist, skipping seed...');
    return;
  }

  // ==================== SUPER ADMIN ROLE ====================
  const superAdminRole = roleRepository.create({
    Name: 'super_admin',
    role_title: 'Super Admin',
  });
  await roleRepository.save(superAdminRole);

  await permissionRepository.save(permissionRepository.create({
    role: superAdminRole,
    permissions: {
      campaign: { add: true, view: true, edit: true, delete: true },
      properties: { add: true, view: true, edit: true, delete: true },
      user_management: { add: true, view: true, edit: true, delete: true },
      buyer: { add: true, view: true, edit: true, delete: true },
      seller: { add: true, view: true, edit: true, delete: true },
      broker: { add: true, view: true, edit: true, delete: true },
    },
  }));
  console.log('✅ Created super_admin role with full permissions');

  // ==================== FREE ROLE ====================
  const freeRole = roleRepository.create({
    Name: 'free_role',
    role_title: 'Free',
  });
  await roleRepository.save(freeRole);

  await permissionRepository.save(permissionRepository.create({
    role: freeRole,
    permissions: {
      campaign: { add: false, view: true, edit: false, delete: false },
      properties: { add: false, view: true, edit: false, delete: false },
    },
  }));
  console.log('✅ Created free_role with view-only permissions');

  // ==================== PLUS ROLE ====================
  const plusRole = roleRepository.create({
    Name: 'plus_role',
    role_title: 'Plus',
  });
  await roleRepository.save(plusRole);

  await permissionRepository.save(permissionRepository.create({
    role: plusRole,
    permissions: {
      campaign: { add: true, view: true, edit: false, delete: false },
      properties: { add: true, view: true, edit: false, delete: false },
    },
  }));
  console.log('✅ Created plus_role');

  // ==================== PRO ROLE ====================
  const proRole = roleRepository.create({
    Name: 'pro_role',
    role_title: 'Pro',
  });
  await roleRepository.save(proRole);

  await permissionRepository.save(permissionRepository.create({
    role: proRole,
    permissions: {
      campaign: { add: true, view: true, edit: true, delete: false },
      properties: { add: true, view: true, edit: true, delete: false },
    },
  }));
  console.log('✅ Created pro_role');

  // ==================== ENTERPRISE ROLE ====================
  const enterpriseRole = roleRepository.create({
    Name: 'enterprise_role',
    role_title: 'Enterprise',
  });
  await roleRepository.save(enterpriseRole);

  await permissionRepository.save(permissionRepository.create({
    role: enterpriseRole,
    permissions: {
      campaign: { add: true, view: true, edit: true, delete: true },
      properties: { add: true, view: true, edit: true, delete: true },
      user_management: { add: true, view: true, edit: true, delete: false },
      buyer: { add: true, view: true, edit: true, delete: true },
      seller: { add: true, view: true, edit: true, delete: true },
      broker: { add: true, view: true, edit: true, delete: true },
    },
  }));
  console.log('✅ Created enterprise_role');

  // NOTE: buyer, seller, broker roles are NOT seeded globally.
  // They are created per-organization when an organization is created.

  // ==================== SUBSCRIPTION PLANS ====================
  console.log('🌱 Seeding subscription plans...');

  await planRepository.save(planRepository.create({
    name: 'free_plan',
    display_name: 'Free Plan',
    description: 'Get started for free. View-only access.',
    price: 0,
    billing_cycle: 'monthly',
    plan_type: PlanType.BASIC,
    role: freeRole,
    is_active: true,
    features: ['View properties', 'View campaigns', 'Email support'],
  }));
  console.log('✅ Created Free Plan');

  await planRepository.save(planRepository.create({
    name: 'plus_plan',
    display_name: 'Plus Plan',
    description: 'Add listings and campaigns.',
    price: 9.99,
    billing_cycle: 'monthly',
    plan_type: PlanType.BASIC,
    role: plusRole,
    is_active: true,
    features: ['All Free features', 'Add properties', 'Add campaigns', 'Priority support'],
  }));
  console.log('✅ Created Plus Plan');

  await planRepository.save(planRepository.create({
    name: 'pro_plan',
    display_name: 'Pro Plan',
    description: 'Add and edit listings with advanced tools.',
    price: 29.99,
    billing_cycle: 'monthly',
    plan_type: PlanType.PRO,
    role: proRole,
    is_active: true,
    features: ['All Plus features', 'Edit properties', 'Edit campaigns', 'Advanced analytics'],
  }));
  console.log('✅ Created Pro Plan');

  await planRepository.save(planRepository.create({
    name: 'enterprise_plan',
    display_name: 'Enterprise Plan',
    description: 'Full access with team management and buyer/seller/broker roles.',
    price: 99.99,
    billing_cycle: 'monthly',
    plan_type: PlanType.PROFESSIONAL,
    role: enterpriseRole,
    is_active: true,
    features: [
      'All Pro features',
      'Delete properties & campaigns',
      'Buyer / Seller / Broker roles',
      'Dedicated support',
      'API access',
    ],
  }));
  console.log('✅ Created Enterprise Plan');

  console.log('🎉 Role and Plan seeding completed!');
}
